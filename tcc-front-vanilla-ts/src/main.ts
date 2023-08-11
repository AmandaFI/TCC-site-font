import "./style.css";

const justBackground = `<div class="container_div" style="position: relative; display: flex">
<canvas width="500" height="500" id="canv" />
</div>`;

const mainPage = `
<div class="container_div" style="position: relative; display: flex">
<div
  id="info"
  class="hover_div"
  style="
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  max-width: 50rem;
  min-height: 20rem;
  overflow: hidden;

  background-color: rgba(0, 0, 0, 0.85);
  color: white;

  display: flex;
  flex-direction: column;
  border: solid;
  border-radius: 10px;
  padding: 5px
  "
>
  <div style="display: flex; flex-direction: column">
  <h2>Bem-Vindo ao questionário do meu TCC!</h2>
  <h4 style="margin: 0">Contextualizando...</h4>
  <p  style="margin: 0">O desenvolvimento de modelos de inteligência artificial, como o ChatGPT, tornou possível que a tecnologia produza textos elaborados e articulados, que são tão semelhantes às produções humanas que muitas vezes é difícil saber se um texto foi escrito por homens ou máquinas.</p>
  <br/>
  <h4  style="margin: 0">Sabendo disso,</h4>
  <p  style="margin: 0">minha proposta com esse questionário é que você leia 5 notícias e tente identificar se elas foram escritas por um ser humano ou pelo ChatGPT. Será que você conseguirá distinguir o homem da tecnologia? Mas tenha cuidado, você pode estar sendo observado pela Matrix, e tudo pode não passar de uma simulação...Boa sorte!</p>
  </div>
  <br/>

  <div style="display: flex; flex-direction: row">
  <label for="email">E-mail:</label>
  <input type="text" id="email-input" required />
  </div>
  <br/>

  <div style="display: flex; flex-direction: column">
  <p>Suas respostas nesse questionário serão utilizadas de forma anônima para fins de análise e escrita de um artigo científico. O e-mail inserido terá como único e exclusivo propósito o controle de usuários que já realizaram o teste, para impedir que a mesma pessoa responda múltiplas vezes e comprometa o resultado da análise.</p>
  <input type="checkbox" id="agree-check-box" required name="Concordo" />
  </div>

  <div style="display: flex; flex-direction: row-reverse">
    <button style="background-color: red; color: white; margin: 2px" id="exit-btn">Sair</button>
    <button style="background-color: blue; color: white; margin: 2px" id="start-btn">Vamos lá!</button>
  </div>
</div>
<canvas width="500" height="500" id="canv" />
</div>
`;

const quizPage = `
<div class="container_div" style="position: relative; display: flex">
<div
  class="hover_div"
  id="wecolme_div"
  style="
    position: absolute;
    width: 60rem !important;
    height: 100% !important;
    display: block;
    z-index: 15;
    background-color: white;
    left: 31%;
    margin: 0 0 0 -150px;
    display: flex;
  "
>
  <div>
    Bem-Vindo a pesquisa do meu TCC! Contextualizando...\nCom o surgimento do ChatGPT tornou-se comum sua utilização para produção de
    textos e notícias. textos.
  </div>
  <button style="background-color: red; color: white" id="exit-btn">Sair</button>
  <button style="background-color: blue; color: white" id="start-btn">Começar</button>
</div>
<canvas width="500" height="500" id="canv" />
</div>`;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = quizPage;

const startBtn = document.querySelector<HTMLInputElement>("#start-btn");
const exitBtn = document.querySelector<HTMLInputElement>("#exit-btn");
const emailInput = document.querySelector<HTMLInputElement>("#email-input");
const agreeCheckBoc = document.querySelector<HTMLInputElement>("#agree-check-box");

startBtn!.addEventListener("click", (e) => {
	document.querySelector<HTMLDivElement>("#app")!.innerHTML = quizPage;
});

exitBtn!.addEventListener("click", (e) => {
	document.querySelector<HTMLDivElement>("#info")!.remove();
});

const canvas = document.querySelector<HTMLCanvasElement>("#canv");
const canvasContext: CanvasRenderingContext2D | null = canvas!.getContext("2d");

// set the width and height of the canvas
canvas!.width = document.body.offsetWidth;
canvas!.height = document.body.offsetHeight;

// draw a black rectangle of width and height same as that of the canvas
canvasContext!.fillStyle = "#000";
canvasContext!.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

const cols = Math.floor(document.body.offsetWidth / 20) + 1;
const ypos = Array(cols).fill(0);

function matrix() {
	// Draw a semitransparent black rectangle on top of previous drawing
	canvasContext!.fillStyle = "#0001";
	canvasContext!.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

	// Set color to green and font to 15pt monospace in the drawing context
	canvasContext!.fillStyle = "#0f0";
	canvasContext!.font = "15pt monospace";

	// for each column put a random character at the end
	ypos.forEach((y, index) => {
		// generate a random character
		const text = String.fromCharCode(Math.random() * 128);

		// x coordinate of the column, y coordinate is already given
		const x = index * 20;
		// render the character at (x, y)
		canvasContext!.fillText(text, x, y);

		// randomly reset the end of the column if it's at least 100px high
		if (y > 100 + Math.random() * 10000) ypos[index] = 0;
		// otherwise just move the y coordinate for the column 20px down,
		else ypos[index] = y + 20;
	});
}

// render the animation at 20 FPS.
let currentMatrixInterval = setInterval(matrix, 50);
