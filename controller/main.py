from serve_website import app as flask_app
from listen_socket import socket_listen
from threading import Thread
import argparse
import websockets
import socket
import asyncio
import time

def website_thread(url):
    print("running website")
    # flask_app.run(host=url, port=3000, debug=False, ssl_context=('localhost.crt', 'localhost.key'))
    flask_app.run(host=url, port=3000, debug=False)

def socket_thread(url, loop):
    asyncio.set_event_loop(loop)
    server = websockets.serve(socket_listen, url, 8765)
    print("running websocket")
    loop.run_until_complete(server)
    loop.run_forever()

def main():
    DEFAULT_URL = socket.gethostbyname(socket.gethostname())

    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default=DEFAULT_URL)
    args = parser.parse_args()

    url = args.host

    print(f"starting on {url}")

    loop = asyncio.get_event_loop()

    t1 = Thread(target=website_thread, args=(url,), daemon=True)
    t2 = Thread(target=socket_thread, args=(url,loop), daemon=True)

    t1.start()
    t2.start()

    try:
        while True:
            time.sleep(0.5)
    except KeyboardInterrupt:
        print("stopping")
        loop.stop()
    finally:
        print("closing threads")

if __name__ == '__main__':
    main()