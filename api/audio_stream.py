from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import io

app = Flask(__name__)

# Configure CORS to allow specific origins
CORS(app, resources={r"/*": {"origins": ["https://cyber-security-pi.vercel.app"]}})

# In-memory storage for signaling and audio data
signaling_data = {
    "offer": None,
    "answer": None,
    "ice_candidates": [],
}
audio_stream_data = io.BytesIO()


@app.route("/offer", methods=["POST", "GET"])
def offer():
    """
    Endpoint to handle WebRTC offers.
    """
    global signaling_data
    if request.method == "POST":
        signaling_data["offer"] = request.json
        return jsonify({"status": "Offer stored"})
    elif request.method == "GET":
        return jsonify(signaling_data["offer"])


@app.route("/answer", methods=["POST", "GET"])
def answer():
    """
    Endpoint to handle WebRTC answers.
    """
    global signaling_data
    if request.method == "POST":
        signaling_data["answer"] = request.json
        return jsonify({"status": "Answer stored"})
    elif request.method == "GET":
        return jsonify(signaling_data["answer"])


@app.route("/ice-candidates", methods=["POST", "GET"])
def ice_candidates():
    """
    Endpoint to handle ICE candidates.
    """
    global signaling_data
    if request.method == "POST":
        signaling_data["ice_candidates"].append(request.json)
        return jsonify({"status": "ICE candidate stored"})
    elif request.method == "GET":
        return jsonify(signaling_data["ice_candidates"])


@app.route("/audio_stream", methods=["POST", "GET"])
def audio_stream():
    """
    Endpoint to handle audio streaming.
    - POST: Stores incoming audio chunks.
    - GET: Streams stored audio chunks to the client.
    """
    global audio_stream_data
    if request.method == "POST":
        # Store audio chunks
        chunk = request.data
        if chunk:
            audio_stream_data.write(chunk)
        return jsonify({"status": "Audio chunk stored"})
    elif request.method == "GET":
        # Stream stored audio chunks
        def generate_audio():
            audio_stream_data.seek(0)
            while True:
                chunk = audio_stream_data.read(1024)
                if not chunk:
                    break
                yield chunk

        return Response(generate_audio(), content_type="audio/wav")


@app.route("/reset", methods=["POST"])
def reset():
    """
    Resets the signaling and audio data.
    """
    global signaling_data, audio_stream_data
    signaling_data = {
        "offer": None,
        "answer": None,
        "ice_candidates": [],
    }
    audio_stream_data = io.BytesIO()
    return jsonify({"status": "Signaling and audio data reset"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)