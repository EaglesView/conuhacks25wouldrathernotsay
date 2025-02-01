export async function startCamera() {
    const video = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

// Function to stop the camera
export function stopCamera() {
    const video = document.getElementById("video");
    if (video.srcObject) {
        let tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop()); // Stop each track
        video.srcObject = null;
    }
}
