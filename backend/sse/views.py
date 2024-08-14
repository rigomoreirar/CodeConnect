# views_sse.py
from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
import time
import json

@csrf_exempt
def sse_view(request):
    def event_stream():
        while True:
            # You would replace this with your actual logic to detect changes
            # Here, we're simulating a change notification every 10 seconds
            time.sleep(4)
            yield 'data: {}\n\n'.format(json.dumps({'message': 'refetch', 'route': 'get-all-data'}))

    return StreamingHttpResponse(event_stream(), content_type='text/event-stream')
