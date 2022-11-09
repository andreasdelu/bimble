export default class DeluDialog {
	constructor(options) {
		this.title = options?.title;
		this.text = options?.text;
		this.image = options?.image;
		this.color = options?.color || "#fff";
		this.id = "DeluDialog-" + Date.now();
	}

	spawn() {
		const container = document.createElement("div");
		container.classList.add("DeluDialogContainer");
		container.id = this.id;
		const background = document.createElement("div");
		background.classList.add("DeluDialogBackground");
		const dialog = document.createElement("div");
		dialog.classList.add("DeluDialogDialog");
		dialog.style.backgroundColor = this.color;
		if (this.image) {
			const img = document.createElement("img");
			img.src = this.image;
			img.classList.add("DeluDialogImage");
			dialog.appendChild(img);
		}
		if (this.text) {
			const p = document.createElement("p");
			p.textContent = this.text;
			p.classList.add("DeluDialogText");
			dialog.appendChild(p);
		}

		background.onclick = (e) => {
			this.kill();
		};

		container.appendChild(background);
		container.appendChild(dialog);
		document.body.appendChild(container);
	}

	kill() {
		document.querySelector(`#${this.id}`).remove();
	}
}
