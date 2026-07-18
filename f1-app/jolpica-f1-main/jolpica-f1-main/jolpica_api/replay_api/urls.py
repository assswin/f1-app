from django.urls import path
from . import views

urlpatterns = [
    path('sessions/<int:year>/<int:round_num>/reprocess', views.reprocess_session, name='reprocess-session'),
    path('sessions/<int:year>/<int:round_num>/reprocess/status', views.reprocess_status, name='reprocess-status'),
]
