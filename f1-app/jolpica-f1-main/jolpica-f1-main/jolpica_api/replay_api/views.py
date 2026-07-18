from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.cache import cache
from django.conf import settings
import subprocess
import threading
import os

def get_task_key(year, round_num, session_type):
    return f"reprocess_{year}_{round_num}_{session_type}"

def run_reprocess_script(task_key, year, round_num, session_type):
    try:
        # Resolve paths
        base_dir = settings.BASE_DIR
        app_root = base_dir.parent.parent
        script_path = app_root / "scripts" / "generate_replay_data.py"
        venv_python = app_root / "scripts" / "venv" / "Scripts" / "python.exe"
        
        if not venv_python.exists():
            venv_python = "python"
        else:
            venv_python = str(venv_python)
            
        print(f"Running: {venv_python} {script_path} --year {year} --round {round_num} --session {session_type}")
        
        subprocess.run(
            [venv_python, str(script_path), "--year", str(year), "--round", str(round_num), "--session", session_type],
            cwd=str(app_root),
            check=True
        )
        cache.set(task_key, "done", timeout=3600)
    except subprocess.CalledProcessError as e:
        print(f"Error running reprocess script: {e}")
        cache.set(task_key, "error", timeout=3600)
    except Exception as e:
        print(f"Unexpected error: {e}")
        cache.set(task_key, "error", timeout=3600)

@api_view(['POST'])
def reprocess_session(request, year, round_num):
    session_type = request.GET.get('type', 'R')
    task_key = get_task_key(year, round_num, session_type)
    
    status = cache.get(task_key)
    if status == "running":
        return Response({"state": "running", "message": "Already running"})
        
    cache.set(task_key, "running", timeout=3600)
    
    # Start background thread
    thread = threading.Thread(
        target=run_reprocess_script,
        args=(task_key, year, round_num, session_type)
    )
    thread.daemon = True
    thread.start()
    
    return Response({"state": "running", "message": "Started reprocessing in background"})

@api_view(['GET'])
def reprocess_status(request, year, round_num):
    session_type = request.GET.get('type', 'R')
    task_key = get_task_key(year, round_num, session_type)
    
    status = cache.get(task_key, "unknown")
    if status == "unknown":
        return Response({"state": "unknown", "message": "No active process found"})
    return Response({"state": status, "message": f"Task is {status}"})
