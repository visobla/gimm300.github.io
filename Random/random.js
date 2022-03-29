function changeText() {
		document.getElementById("test").innerHTML=("Text has changed");
	}

function changeTextBack() {
		document.getElementById("test").innerHTML=("A paragraph");
	}




function changeTitleColor() {
        document.getElementById("title").style.color = "red";
}

function changeTitleColorBack() {
        document.getElementById("title").style.color = "black";
}



function submit() {
        document.getElementById("submitted").innerHTML=("Submitted!");
}

function getRandomArbitrary(min, max) {
	// return Math.random() * (max - min) + min;
	let minimum = parseInt(document.getElementById("minimum").value);
	let maximum = parseInt(document.getElementById("maximum").value);
	let number = Math.random() * (maximum - minimum) + minimum;
	document.getElementById("random").innerHTML = (number);
	let multiply = document.getElementById("multiply");
	for (var i = 1; i <= number; i++) {
		let element = document.createElement("div")
		element.classList.add('space-invader');
		let space = document.createTextNode('space')
		element.appendChild(space);
		multiply.appendChild(element);
	}
}

