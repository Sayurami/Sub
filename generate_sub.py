import whisper
import sys
import os

video_path = sys.argv[1] if len(sys.argv) > 1 else "movie.mp4"

if not os.path.exists(video_path):
    print("Video file not found!")
    sys.exit(1)

model = whisper.load_model("base")  # small/medium/large

print(f"Transcribing {video_path} ...")
result = model.transcribe(video_path)

vtt_filename = os.path.splitext(video_path)[0] + ".vtt"
with open(vtt_filename, "w", encoding="utf-8") as f:
    f.write("WEBVTT\n\n")
    for i, segment in enumerate(result["segments"]):
        start = segment["start"]
        end = segment["end"]
        text = segment["text"].strip()
        f.write(f"{i+1}\n")
        f.write(f"{start:.3f} --> {end:.3f}\n")
        f.write(f"{text}\n\n")

print(f"Subtitles saved as {vtt_filename}")
