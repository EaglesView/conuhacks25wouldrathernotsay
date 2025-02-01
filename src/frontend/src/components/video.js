export async function startCamera() {
    const video = document.getElementById("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
}

export async function captureFrame() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("file", blob);

        const response = await fetch("http://127.0.0.1:8000/process-frame/", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        console.log("Frame processed:", result);
    }, "image/jpeg");
}
