const tecla = {
  W: 87,
  S: 83,
  D: 68,
};
const somDisparo = document.getElementById("somDisparo");
const somExplosao = document.getElementById("somExplosao");
const musica = document.getElementById("musica");
const somGameover = document.getElementById("somGameover");
const somPerdido = document.getElementById("somPerdido");
const somResgate = document.getElementById("somResgate");

function start() {
  $("#inicio").hide();

  $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
  $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
  $("#fundoGame").append("<div id='inimigo2'></div>");
  $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
  $("#fundoGame").append("<div id='placar'></div>");
  $("#fundoGame").append("<div id='energia'></div>");

  let jogo = {};
  const speedFundo = 30;
  const speedBullet = 15;


  let speedFriend = 1;
  let speedEnemy1 = 5;
  let speedEnemy2 = 3;
  let podeAtirar = true;
  let fimDeJogo = false;
  let pontos = 0;
  let salvos = 0;
  let perdidos = 0;
  let energiaAtual = 3;

  jogo.timer = setInterval(loop, speedFundo);
  jogo.pressionou = [];

  musica.addEventListener(
    "ended",
    () => {
      musica.currentTime = 0;
      musica.play();
    },
    false
  );
  musica.play();

  $(document).keydown((event) => {
    jogo.pressionou[event.which] = true;
  });
  $(document).keyup((event) => {
    jogo.pressionou[event.which] = false;
  });

  function loop() {
    moveFundo();
    moveJogador();
    moveInimigo1();
    moveInimigo2();
    moveAmigo();
    colisao();
    placar();
    energia();
  }

  function moveFundo() {
    let esquerda = parseInt($("#fundoGame").css("background-position"));
    $("#fundoGame").css("background-position", esquerda - 1);
  }

  function moveJogador() {
    if (jogo.pressionou[tecla.W]) {
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo - 10);
      if (topo <= 0) {
        $("#jogador").css("top", topo + 10);
      }
    }
    if (jogo.pressionou[tecla.S]) {
      let topo = parseInt($("#jogador").css("top"));
      $("#jogador").css("top", topo + 10);
      if (topo >= 434) {
        $("#jogador").css("top", topo - 10);
      }
    }
    if (jogo.pressionou[tecla.D]) {
      disparo();
    }
  }

  let positionYEnemy = parseInt(Math.random() * 334);
  function moveInimigo1() {
    let positionX = parseInt($("#inimigo1").css("left"));
    $("#inimigo1").css("left", positionX - speedEnemy1);
    $("#inimigo1").css("top", positionYEnemy);
    if (positionX <= 0) {
      positionYEnemy = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", positionYEnemy);
    }
  }

  function moveInimigo2() {
    let positionX = parseInt($("#inimigo2").css("left"));
    $("#inimigo2").css("left", positionX - speedEnemy2);
    if (positionX <= 0) {
      $("#inimigo2").css("left", 775);
    }
  }

  function moveAmigo() {
    let positionX = parseInt($("#amigo").css("left"));
    $("#amigo").css("left", positionX + speedFriend);
    if (positionX > 906) {
      $("#amigo").css("left", 0);
    }
  }

  function disparo() {
    if (podeAtirar) {
      somDisparo.play();
      podeAtirar = false;

      topo = parseInt($("#jogador").css("top"));
      posicaoX = parseInt($("#jogador").css("left"));
      tiroX = posicaoX + 190;
      topoTiro = topo + 37;
      $("#fundoGame").append("<div id='disparo'></div");
      $("#disparo").css("top", topoTiro);
      $("#disparo").css("left", tiroX);

      var tempoDisparo = window.setInterval(executaDisparo, 30);
    }

    function executaDisparo() {
      posicaoX = parseInt($("#disparo").css("left"));
      $("#disparo").css("left", posicaoX + speedBullet);
      if (posicaoX >= 900) {
        window.clearInterval(tempoDisparo);
        $("#disparo").remove();
        podeAtirar = true;
      }
    }
  }

  function colisao() {
    let colisao1 = $("#jogador").collision($("#inimigo1"));
    let colisao2 = $("#jogador").collision($("#inimigo2"));
    let colisao3 = $("#disparo").collision($("#inimigo1"));
    let colisao4 = $("#disparo").collision($("#inimigo2"));
    let colisao5 = $("#jogador").collision($("#amigo"));
    let colisao6 = $("#inimigo2").collision($("#amigo"));

    if (colisao1.length > 0) {
      energiaAtual--;
      let inimigo1X = parseInt($("#inimigo1").css("left"));
      let inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);

      let positionYEnemy = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", positionYEnemy);
    }
    if (colisao2.length > 0) {
      energiaAtual--;
      let inimigo2X = parseInt($("#inimigo2").css("left"));
      let inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X, inimigo2Y);
      $("#inimigo2").remove();
      reposicionaInimigo2();
    }
    if (colisao3.length > 0) {
      pontos += 100;
      speedEnemy1 += 0.3;
      let inimigo1X = parseInt($("#inimigo1").css("left"));
      let inimigo1Y = parseInt($("#inimigo1").css("top"));
      explosao1(inimigo1X, inimigo1Y);
      $("#disparo").css("left", 950);
      let positionYEnemy = parseInt(Math.random() * 334);
      $("#inimigo1").css("left", 694);
      $("#inimigo1").css("top", positionYEnemy);
    }
    if (colisao4.length > 0) {
      pontos += 50;
      let inimigo2X = parseInt($("#inimigo2").css("left"));
      let inimigo2Y = parseInt($("#inimigo2").css("top"));
      explosao2(inimigo2X, inimigo2Y);
      $("#inimigo2").remove();
      $("#disparo").css("left", 950);
      reposicionaInimigo2();
    }
    if (colisao5.length > 0) {
      salvos++;
      somResgate.play();
      reposicionaAmigo();
      $("#amigo").remove();
    }
    if (colisao6.length > 0) {
      perdidos++;
      let amigoX = parseInt($("#amigo").css("left"));
      let amigoY = parseInt($("#amigo").css("top"));
      explosao3(amigoX, amigoY);
      $("#amigo").remove();
      reposicionaAmigo();
    }
  }

  function explosao1(inimigo1X, inimigo1Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao1'></div>");
    $("#explosao1").css("background-image", "url('./images/explosao.png')");
    let div = $("#explosao1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({ width: 200, opacity: 0 }, "slow");
    let tempoExplosao = setInterval(removeExplosao, 1000);
    function removeExplosao() {
      div.remove();
      clearInterval(tempoExplosao);
    }
  }

  function reposicionaInimigo2() {
    let tempoColisao = setInterval(reposiciona, 5000);
    function reposiciona() {
      clearInterval(tempoColisao);
      if (!fimDeJogo) {
        $("#fundoGame").append("<div id='inimigo2'></div>");
      }
    }
  }

  function explosao2(inimigo2X, inimigo2Y) {
    somExplosao.play();
    $("#fundoGame").append("<div id='explosao2'></div>");
    $("#explosao2").css("background-image", "url('./images/explosao.png')");
    let div2 = $("#explosao2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");
    let tempoExplosao2 = setInterval(removeExplosao2, 1000);
    function removeExplosao2() {
      div2.remove();
      clearInterval(tempoExplosao2);
    }
  }

  function reposicionaAmigo() {
    let tempoAmigo = setInterval(reposiciona, 6000);
    function reposiciona() {
      clearInterval(tempoAmigo);
      if (!fimDeJogo) {
        $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
      }
    }
  }

  function explosao3(amigoX, amigoY) {
    somPerdido.play();
    $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
    $("#explosao3").css("top", amigoY);
    $("#explosao3").css("left", amigoX);
    let tempoExplosao3 = setInterval(resetaExplosao, 1000);
    function resetaExplosao() {
      $("#explosao3").remove();
      clearInterval(tempoExplosao3);
    }
  }

  function placar() {
    $("#placar").html(
      `<h2>Pontos: ${pontos} Salvos: ${salvos} Perdidos: ${perdidos}</h2>`
    );
  }

  function energia() {
    if (energiaAtual == 3) {
      $("#energia").css("background-image", "url('./images/energia3.png')");
    }
    if (energiaAtual == 2) {
      $("#energia").css("background-image", "url('./images/energia2.png')");
    }
    if (energiaAtual == 1) {
      $("#energia").css("background-image", "url('./images/energia1.png')");
    }
    if (energiaAtual == 0) {
      $("#energia").css("background-image", "url('./images/energia0.png')");
      gameOver();
    }
  }

  function gameOver() {
    fimDeJogo = true;
    musica.pause();
    somGameover.play();

    clearInterval(jogo.timer);
    $("#jogador").remove();
    $("#inimigo1").remove();
    $("#inimigo2").remove();
    $("#amigo").remove();

    $("#fundoGame").append("<div id='fim'></div>");
    $("#fim").html(
      `<h1>Game Over</h1><p>Sua pontuação foi: ${pontos}</p><div id='reinicia' onClick=reiniciaJogo()><h3>Jogar novamente</h3></div>`
    );
  }
}

function reiniciaJogo() {
  somGameover.pause();
  $("#fim").remove();
  start();
}
