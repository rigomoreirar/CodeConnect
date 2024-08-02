# views_sse.py

from django.http import StreamingHttpResponse
import time

def sse_view(request):
    def event_stream():
        while True:
            yield f'data: The current time is {time.time()}\n\n'
            time.sleep(5)
    
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['Connection'] = 'keep-alive'
    return response
