export default async function optimizeImage(file, maxResX = 0, maxResY = 0) {
	let reader = new FileReader();
	reader.readAsDataURL(file);

	return new Promise((resolve, reject) => {
		reader.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = maxResX;
			canvas.height = maxResY;

			let img = new Image();
			img.onload = function () {
				let ratio;
				if (!maxResX || !maxResY) {
					canvas.width = this.width;
					canvas.height = this.height;
				}
				if (this.width > this.height) {
					ratio = this.width / this.height;
					canvas.height = canvas.width / ratio;
				} else {
					ratio = this.height / this.width;
					canvas.width = canvas.height / ratio;
				}
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				/* resolve(canvas.toDataURL(file.type)); */
				canvas.toBlob(
					(blob) => {
						resolve(blob);
					},
					"image/webp",
					0.7
				);
			};
			img.src = reader.result;
		};
	});
}
