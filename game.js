console.log('Super-Man Escapes');

let frames = 0;
var som_hit = new Audio();
som_hit.src = './Sons/hit.wav'

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

let source = new Image();
source.src = "./imagens/src_imagens.png";

function novoChao(){
    var chao = {
        sourceX: 51,
        sourceY: 3254,
        recorte_largura: 812,
        recorte_altura: 542,
        x: 0,
        y: canvas.height - 112,
        largura: 224,
        altura: 112,
        atualiza() {
            var movimento_chao = 1;
            var repita = chao.largura / 2;
            var movimentacao = chao.x - movimento_chao;

            chao.x = movimentacao % repita;
        },
        desenho(){
            ctx.drawImage(
                source,
                chao.sourceX, chao.sourceY,
                chao.recorte_largura, chao.recorte_altura,
                chao.x, chao.y,
                chao.largura, chao.altura
            );
            ctx.drawImage(
                source,
                chao.sourceX, chao.sourceY,
                chao.recorte_largura, chao.recorte_altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura
            );
        }
    }
    return chao
};

var fundo = {
    sourceX: 42,
    sourceY: 2624,
    recorte_largura: 1203,
    recorte_altura: 600,
    x: 0,
    y: canvas.height - 260,
    largura: 300,
    altura: 150,
    desenho(){
        ctx.fillStyle = '#cbecf1';
        ctx.fillRect(0,0, canvas.width, canvas.height / 2)
        ctx.drawImage(
            source,
            fundo.sourceX, fundo.sourceY,
            fundo.recorte_largura, fundo.recorte_altura,
            fundo.x, fundo.y,
            fundo.largura, fundo.altura
        );
        ctx.drawImage(
            source,
            fundo.sourceX, fundo.sourceY,
            fundo.recorte_largura, fundo.recorte_altura,
            (fundo.x + fundo.largura), fundo.y,
            fundo.largura, fundo.altura
        );
    }
}
function colisao(super_man_voando, chao){
    var supermanY = super_man_voando.y + super_man_voando.altura;
    var chaoY = chao.y;

    if(supermanY >= chaoY) {
        return true;
    }
    else {
        return false;
    }
}
function novoSuperMan(){
    var super_man_voando = {
        sourceX: 365,
        sourceY: 1734,
        recorte_largura: 312,
        recorte_altura: 163,
        x: 10,
        y: 80,
        pulo: 4.6,
        pula() {
            super_man_voando.velocidade = -super_man_voando.pulo;
        },
        largura: 42,
        altura: 32,
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (colisao(super_man_voando, globais.chao)) {
                som_hit.play();

                mudarTela(telas.gameover);

                return;
            }
            super_man_voando.velocidade = super_man_voando.velocidade + super_man_voando.gravidade;
            super_man_voando.y = super_man_voando.y + super_man_voando.velocidade;
        },
        desenho() {
            ctx.drawImage(
                source,
                super_man_voando.sourceX, super_man_voando.sourceY,
                super_man_voando.recorte_largura, super_man_voando.recorte_altura,
                super_man_voando.x, super_man_voando.y,
                super_man_voando.largura, super_man_voando.altura
            );
        }
    }
    return super_man_voando;
};

var tela_ready = {
    sourceX: 2612,
    sourceY: 207,
    recorte_largura: 1057,
    recorte_altura: 635,
    x: (canvas.width / 2) - (300 / 2),
    y: 50,
    largura: 300,
    altura: 150,
    desenho(){
        ctx.drawImage(
            source,
            tela_ready.sourceX, tela_ready.sourceY,
            tela_ready.recorte_largura, tela_ready.recorte_altura,
            tela_ready.x, tela_ready.y,
            tela_ready.largura, tela_ready.altura
        );
    }
}

var globais = {};
let tela_atual = {};
function mudarTela(nova_tela) {
    tela_atual = nova_tela;

    if(tela_atual.iniciar) {
        tela_atual.iniciar();
    }
}

function novoKrypt() {
    var krypt = {
        largura: 50,
        altura: 300,
        recorte_largura: 96,
        recorte_altura: 448,
        chao: {
            sourceX: 200,
            sourceY: 2024,
        },
        ceu: {
            sourceX: 331,
            sourceY: 2041,
        },
        espaco: 80,
        desenho(){
            krypt.pares.forEach(function (par) {
                var yRandom = par.y;
                var espacamento_krypt = 100;


                var kryptCeuX = par.x;
                var kryptCeuY = yRandom;

                //CÉU
                ctx.drawImage(
                    source,
                    krypt.ceu.sourceX, krypt.ceu.sourceY,
                    krypt.recorte_largura, krypt.recorte_altura,
                    kryptCeuX, kryptCeuY,
                    krypt.largura, krypt.altura
                )

                var kryptChaoX = par.x;
                var kryptChaoY = krypt.altura + espacamento_krypt + yRandom;
                //CHÃO
                ctx.drawImage(
                    source,
                    krypt.chao.sourceX, krypt.chao.sourceY,
                    krypt.recorte_largura, krypt.recorte_altura,
                    kryptChaoX, kryptChaoY,
                    krypt.largura, krypt.altura
                )

                par.kryptCeu = {
                    x: kryptCeuX,
                    y: krypt.altura + kryptCeuY,
                }
                par.kryptChao = {
                    x: kryptChaoX,
                    y: kryptChaoY
                }
            })
        },

        colidesuperman(par){
            var cabecasuperman = globais.super_man_voando.y;
            var pesuperman = globais.super_man_voando.y + globais.super_man_voando.altura;

            if(globais.super_man_voando.x >= par.x){
                if(cabecasuperman <= par.kryptCeu.y) {
                    return true;
                }

                if(pesuperman >= par.kryptChao.y) {
                    return true;
                }
            }



            return false;
    },

        pares: [],
        atualiza(){
            var passou100frames = frames % 100 === 0;
            if(passou100frames) {
                krypt.pares.push({
                        x: canvas.width,
                        y: -250 * Math.random() + 1,
                    });
            }

            krypt.pares.forEach(function (par){
                par.x = par.x - 2;

                if(krypt.colidesuperman(par)){
                    som_hit.play();
                    mudarTela(telas.gameover);
                }

                if (par.x + krypt.largura <= 0) {
                    krypt.pares.shift();
                }
            })

        }
    }
    return krypt;
};

function novoPlacar(){
    var placar = {
        pontuacao: 0,
        desenho() {
            ctx.font = '35px "VT323"';
            ctx.textAlign = 'right';
            ctx.fillStyle = 'yellow';
            ctx.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
        },
        atualiza() {
            var intervalo_frames = 20;
            var intervalo_pass = frames % intervalo_frames === 0;

            if(intervalo_pass) {
                placar.pontuacao = placar.pontuacao + 1;
            }
        },
    }

    return placar;
}

var telas = {
    inicio: {
        iniciar() {
            globais.super_man_voando = novoSuperMan();
            globais.chao = novoChao();
            globais.krypt = novoKrypt();
        },
        desenho() {
            fundo.desenho();
            globais.super_man_voando.desenho();
            globais.chao.desenho();
            tela_ready.desenho();
        },
        click(){
            mudarTela(telas.jogo)
        },
        atualiza() {
            globais.chao.atualiza();
        },
    },
};
telas.jogo = {
    iniciar() {
        globais.placar = novoPlacar();
    },
    desenho() {
        fundo.desenho();
        globais.krypt.desenho();
        globais.chao.desenho();
        globais.super_man_voando.desenho();
        globais.placar.desenho();
    },
    click() {
        globais.super_man_voando.pula();
    },
    atualiza() {
        globais.krypt.atualiza();
        globais.chao.atualiza();
        globais.super_man_voando.atualiza();
        globais.placar.atualiza();
    },
};

var msggameover = {
    sourceX: 1329,
    sourceY: 287,
    recorte_largura: 520,
    recorte_altura: 78,
    x: (canvas.width / 2) - (300 / 2),
    y: 50,
    largura: 300,
    altura: 150,
    desenho(){
        ctx.drawImage(
            source,
            msggameover.sourceX, msggameover.sourceY,
            msggameover.recorte_largura, msggameover.recorte_altura,
            msggameover.x, msggameover.y,
            msggameover.largura, msggameover.altura
        );
    }
}

telas.gameover = {
    desenho() {
        msggameover.desenho();
    },
    atualiza() {

    },
    click() {
        mudarTela(telas.inicio)
    }
}

function loop() {
    tela_atual.desenho();
    tela_atual.atualiza();

    frames = frames + 1;

    requestAnimationFrame(loop);
}

window.addEventListener('click', function (){
    if(tela_atual.click()){
        tela_atual.click();
    }
});

mudarTela(telas.inicio);
loop();