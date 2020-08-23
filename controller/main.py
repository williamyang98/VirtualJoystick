from serve_website import app as flask_app
from listen_socket import socket_listen
from threading import Thread
import argparse
import websockets
import asyncio
import time

def website_thread(url):
    print("Starting server")
    # flask_app.run(host=url, port=3000, debug=False, ssl_context=('localhost.crt', 'localhost.key'))
    flask_app.run(host=url, port=3000, debug=False)

def socket_thread(url):
    server = websockets.serve(socket_listen, url, 8765)
    asyncio.get_event_loop().run_until_complete(server)

    try:
        print("Running client")
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("Stopping listener")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="192.168.2.10")
    args = parser.parse_args()

    url = args.host

    t1 = Thread(target=website_thread, args=(url,))
    # t2 = Thread(target=socket_thread, args=(url,))

    t1.start()
    # t2.start()

    try:
        socket_thread(url)
    except KeyboardInterrupt:
        print("Stopping")
    finally:
        t1.join()
        # t2.join()

if __name__ == '__main__':
    main()