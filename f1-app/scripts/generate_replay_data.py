import os
import sys
import json
import argparse
from pathlib import Path
import numpy as np
import pandas as pd

# Add f1-race-replay to path to import its modules
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "f1-race-replay"))

from src.f1_data import get_race_telemetry, enable_cache, load_session, get_circuit_rotation # type: ignore

# Fix JSON serialization for numpy types
class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        if pd.isna(obj):
            return None
        return super(NpEncoder, self).default(obj)

def main():
    parser = argparse.ArgumentParser(description="Generate static JSON replay data.")
    parser.add_argument("--year", type=int, default=2024)
    parser.add_argument("--round", type=int, default=12)
    parser.add_argument("--session", type=str, default="R")
    args = parser.parse_args()

    enable_cache()
    
    print(f"Loading F1 {args.year} Round {args.round} Session '{args.session}'")
    session = load_session(args.year, args.round, args.session)
    
    if not session:
        print("Failed to load session.")
        return

    print("Extracting telemetry (this might take a minute)...")
    telemetry = get_race_telemetry(session, session_type=args.session)
    
    # Track Data
    circuit_rotation = get_circuit_rotation(session)
    example_lap = session.laps.pick_fastest().get_telemetry()
    track_points = [{"x": float(x), "y": float(y)} for x, y in zip(example_lap["X"], example_lap["Y"])]
    
    track_data = {
        "track_points": track_points,
        "rotation": float(circuit_rotation),
        "circuit_name": session.event.get('Location', '')
    }

    # Session Data
    drivers_list = []
    for drv in session.drivers:
        drv_info = session.get_driver(drv)
        drivers_list.append({
            "abbreviation": str(drv_info.get("Abbreviation", "")),
            "driver_number": str(drv_info.get("BroadcastName", "").split(" ")[0]),
            "full_name": str(drv_info.get("FullName", "")),
            "team_name": str(drv_info.get("TeamName", "")),
            "team_color": f"#{drv_info.get('TeamColor', 'ffffff')}"
        })

    session_data = {
        "year": args.year,
        "round_number": args.round,
        "event_name": session.event.get("EventName", ""),
        "circuit": session.event.get("Location", ""),
        "country": session.event.get("Country", ""),
        "session_type": args.session,
        "drivers": drivers_list
    }

    # Laps Data
    laps_list = []
    if hasattr(session, 'laps'):
        for _, lap in session.laps.iterrows():
            if pd.isna(lap.get('LapTime')):
                continue
            lap_time = lap['LapTime']
            # Format timedelta
            total_seconds = lap_time.total_seconds()
            mins = int(total_seconds // 60)
            secs = int(total_seconds % 60)
            ms = int((total_seconds - int(total_seconds)) * 1000)
            time_str = f"{mins}:{secs:02d}.{ms:03d}" if mins > 0 else f"{secs}.{ms:03d}"
            
            laps_list.append({
                "driver": str(lap.get("Driver", "")),
                "lap_number": int(lap.get("LapNumber", 0)),
                "lap_time": time_str
            })

    output_data = {
        "frames": telemetry["frames"],
        "track_statuses": telemetry["track_statuses"],
        "total_laps": telemetry["total_laps"],
        "driver_colors": telemetry["driver_colors"],
        "track_data": track_data,
        "session_data": session_data,
        "laps_data": {"laps": laps_list}
    }

    # Save to public directory
    output_dir = Path(__file__).parent.parent / "public" / "data" / str(args.year) / str(args.round)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = output_dir / "replay.json"
    print(f"Saving to {output_path}...")
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(output_data, f, cls=NpEncoder, separators=(',', ':'))
        
    print("Done!")

if __name__ == "__main__":
    main()
