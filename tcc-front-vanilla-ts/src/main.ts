import { checkEmail, getRandomNewsArticles, labelType, newsArticleType, registerSubject } from "./api";
import "./style.css";

(() => {
	const welcomePage = () => {
		const welcomePageHtml = `
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
        padding: 10px
        "
      >
        <div style="display: flex; flex-direction: column">
          <h2 style="color: #0f0">Bem-Vindo ao questionário do meu TCC!</h2>
          <h4 style="margin: 0">Contextualizando...</h4>
          <p  style="margin: 0">O desenvolvimento de modelos de inteligência artificial, como o ChatGPT, tornou possível que a tecnologia produza textos elaborados e articulados, que são tão semelhantes às produções humanas que muitas vezes é difícil saber se um texto foi escrito por homens ou máquinas.</p>
          <br/>
          <h4  style="margin: 0">Sabendo disso,</h4>
          <p  style="margin: 0">minha proposta com esse questionário é que você leia 5 notícias (em inglês) e tente identificar se elas foram escritas por um ser humano ou pelo ChatGPT. Será que você conseguirá distinguir o homem da máquina ? Mas tenha cuidado, você pode estar sendo observado pela Matrix, e tudo pode não passar de uma simulação... Boa sorte!</p>
        </div>
        <br/>
        <div style="display: flex; flex-direction: row">
          <label for="email" style="font-size: 1.2em; font-family: Courier, monospace;">E-mail:
          <input type="text" id="email-input" required />
        </label>
        </div>
        <br/>
        <div id="agree-div">
          <p id="agreeCheckText">Suas respostas nesse questionário serão utilizadas de forma anônima para fins de análise e escrita de um artigo científico. O e-mail inserido terá como único e exclusivo propósito o controle de usuários que já realizaram o teste, para impedir que a mesma pessoa responda múltiplas vezes e comprometa o resultado da análise.</p>
          <div>
            <input type="checkbox" id="agree-check-box" required name="Concordo" />
            <label for="agree">Concordo</label>
          </div>
        </div>
        <div style="display: flex; flex-direction: row-reverse">
          <button style="background-color: red; color: white; margin: 3px" id="exit-btn">Sair</button>
          <button style="background-color: blue; color: white; margin: 3px" id="start-btn">Vamos lá!</button>
        </div>
      </div>
      <canvas width="500" height="500" id="canv" />
    </div>
  `;
		const setUpListeners = () => {
			document.querySelector<HTMLInputElement>("#start-btn")!.addEventListener("click", (_e) => {
				const emailInput = document.querySelector<HTMLInputElement>("#email-input");
				const agreeCheckBox = document.querySelector<HTMLInputElement>("#agree-check-box");

				const emailValidatorRegExp =
					/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

				const value = emailInput!.value.trim();
				if (value !== "" && agreeCheckBox!.checked) {
					if (emailValidatorRegExp.test(value)) {
						checkEmail(value)
							.then((response) => {
								if (!response.data) {
									subjectEmail = value;
									setUpQuizPage();
								} else alert("E-mail inválido.");
							})
							.catch((e) => console.log(e));
					} else alert("E-mail inválido.");
				} else alert("Todos os campos obrigatórios precisam ser preenchidos para continuar.");
			});

			document.querySelector<HTMLInputElement>("#exit-btn")!.addEventListener("click", (_e) => {
				document.querySelector<HTMLDivElement>("#info")!.remove();
			});
		};

		document.querySelector<HTMLDivElement>("#app")!.innerHTML = welcomePageHtml;
		setUpBackground();
		setUpListeners();
	};

	type answersType = {
		[newsId: number]: labelType;
	};

	const setUpQuizPage = () => {
		let newsArticles: newsArticleType[] | undefined = undefined;
		let displayedNewsArticleIndex = 0;
		const subjectAnswers: answersType = {};

		const setUpNewsArticles = () => {
			if (!newsArticles)
				getRandomNewsArticles(5)
					.then((response) => {
						newsArticles = response.data;
						console.log(response);
						display();
					})
					.catch((e) => console.log(e));
		};

		const setUpListeners = () => {
			document.querySelector<HTMLInputElement>("#next-btn")!.addEventListener("click", (_e) => {
				document.getElementsByName("answer").forEach((item) => {
					if (item instanceof HTMLInputElement) {
						if (item.checked) {
							subjectAnswers[displayedNewsArticleIndex] = item.value as labelType;
							console.log(subjectAnswers);
							return;
						}
					}
				});

				if (subjectAnswers[displayedNewsArticleIndex]) {
					displayedNewsArticleIndex += 1;
					if (displayedNewsArticleIndex < NEWS_ARTICLE_QUANTITY) {
						display();
						checkRadioBtn();
					} else calcResult();
				} else {
					alert("Classifique a notícia antes de continuar.");
				}
			});

			document.querySelector<HTMLInputElement>("#back-btn")!.addEventListener("click", (_e) => {
				displayedNewsArticleIndex -= 1;
				if (displayedNewsArticleIndex < 0) welcomePage();
				else {
					display();
					checkRadioBtn();
				}
			});
		};

		const checkRadioBtn = () => {
			if (subjectAnswers[displayedNewsArticleIndex]) {
				if (subjectAnswers[displayedNewsArticleIndex] === "H")
					document.querySelector<HTMLInputElement>("#humanRadio")!.checked = true;
				else if (subjectAnswers[displayedNewsArticleIndex] === "G")
					document.querySelector<HTMLInputElement>("#gptRadio")!.checked = true;
				else console.log("something wrong");
			}
		};

		const calcResult = () => {
			const right = Object.entries(subjectAnswers).reduce(
				(acc, [index, answer]) => (newsArticles![+index].label === answer ? (acc += 1) : acc),
				0
			);
			const score = right / NEWS_ARTICLE_QUANTITY;
			registerSubject(subjectEmail, score)
				.then((_response) => resultPage(right))
				.catch((_e) => alert("Erro ao salvar resultado."));
		};

		const renderQuizPage = () => {
			document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <div class="container_div" style="position: relative; display: flex">
        <div
          style="
          position: absolute;
          top: 50%;
          left: 50%;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          max-width: 50rem;
          min-height: 20rem;
          overflow-x: hidden;
          background-color: rgba(0, 0, 0, 0.85);
          color: white;
          display: flex;
          flex-direction: column;
          border: solid;
          border-radius: 10px;
          padding: 10px
          "
        >
          <div style="display: flex; flex-direction: column">
            <h2 style="color: #0f0">Notícia ${displayedNewsArticleIndex + 1}/5</h2>
          </div>
          <div style="border: solid; border-color: #0f0; border-radius: 5px; max-height: 25rem; overflow-y: scroll; padding: 7px; text-align: justify; text-justify: inter-word;">
            <p>${newsArticles !== undefined ? newsArticles[displayedNewsArticleIndex].content : "Erro."}</p>
          </div>
          <br/>
          <div style="display: flex; flex-direction: row">
            <input type="radio" id="humanRadio" name="answer" value="H">
            <label for="html">Humano</label><br>
            <input type="radio" id="gptRadio" name="answer" value="G">
            <label for="css">ChatGPT</label><br>
          </div>
          <br/>
      
          <div style="display: flex; flex-direction: row-reverse">
            <button style="background-color: red; color: white; margin: 3px" id="back-btn">Voltar</button>
            <button style="background-color: blue; color: white; margin: 3px" id="next-btn">Próxima</button>
          </div>
        </div>
        <canvas width="500" height="500" id="canv" />
      </div>`;
		};

		setUpNewsArticles();
		setUpBackground();

		const display = () => {
			renderQuizPage();
			setUpBackground();
			setUpListeners();
		};
	};

	const resultPage = (score: number) => {
		document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
      <div class="container_div" style="position: relative; display: flex">
      <div
      style="
      position: absolute;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
      max-width: 50rem;
      min-width: 20rem;
      min-height: 10rem;
      overflow-x: hidden;
      background-color: rgba(0, 0, 0, 0.85);
      color: white;
      display: flex;
      flex-direction: column;
      border: solid;
      border-radius: 10px;
      padding: 10px
      "
    >
        <h2 style="color: #0f0; text-align: center;">Obrigado por participar!</h2>
        <h2 style="color: white; text-align: center;">Acertos: ${score}/${NEWS_ARTICLE_QUANTITY}</h2>
        
    </div>
        <canvas width="500" height="500" id="canv" />
      </div>;
      `;
		setUpBackground();
	};

	let currentMatrixInterval: number | null = null;
	const setUpBackground = () => {
		const canvas = document.querySelector<HTMLCanvasElement>("#canv");
		const canvasContext: CanvasRenderingContext2D | null = canvas!.getContext("2d");

		if (currentMatrixInterval !== null) {
			console.log(currentMatrixInterval);
			clearInterval(currentMatrixInterval);
			currentMatrixInterval = null;
		}
		// set the width and height of the canvas
		canvas!.width = document.body.offsetWidth;
		canvas!.height = document.body.offsetHeight;

		// draw a black rectangle of width and height same as that of the canvas
		canvasContext!.fillStyle = "#000";
		canvasContext!.fillRect(0, 0, document.body.offsetWidth, document.body.offsetHeight);

		const cols = Math.floor(document.body.offsetWidth / 20) + 1;
		const ypos = Array(cols).fill(0);

		const matrix = () => {
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
		};

		// render the animation at 20 FPS.
		currentMatrixInterval = setInterval(matrix, 50);
	};

	const NEWS_ARTICLE_QUANTITY = 5;
	let subjectEmail = "";
	welcomePage();
})();
