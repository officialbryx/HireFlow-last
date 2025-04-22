# Gunicorn configuration file
import multiprocessing
import os

# Server socket
bind = f"0.0.0.0:{os.environ.get('PORT', '10000')}"
backlog = 2048

# Worker processes - Optimize for memory
workers = 1  # Single worker to minimize memory usage
worker_class = 'gevent'
worker_connections = 250  # Reduced connections further
timeout = 300  # 5 minutes timeout
keepalive = 2

# Memory optimization
max_requests = 500  # Reduced max requests before worker restart
max_requests_jitter = 25
preload_app = True  # Load app code before forking workers

# Strict memory limits
limit_request_line = 1024  # Reduced from 4096
limit_request_fields = 50   # Reduced from 100
limit_request_field_size = 4096  # Reduced from 8190

# Add memory watchdog
worker_max_memory = 512  # MB
worker_abort_on_error = True

# Logging
accesslog = '-'
errorlog = '-'
loglevel = 'info'

# Process naming
proc_name = 'hireflow-backend'

# Server mechanics
daemon = False
pidfile = None
umask = 0
user = None
group = None
tmp_upload_dir = None

# SSL
keyfile = None
certfile = None
