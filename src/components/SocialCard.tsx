import React from 'react';

interface Sombra {
    x: number; y: number; blur: number; cor: string; ativa: boolean;
}

interface SocialCardProps {
    saudacao: string; frase: string; corPrincipal: string; logoMarca?: string;
    fonteFrase: string; fonteSaudacao: string;
    corFonteSaudacao: string; corFonteFrase: string;
    mostrarFundoSaudacao: boolean;
    tamanhoSaudacao: number; xSaudacao: number; ySaudacao: number;
    tamanhoFrase: number; xFrase: number; yFrase: number;
    imagemFundo?: string; opacidadeFundo: number; blurFundo: number;
    sombraS: Sombra; sombraF: Sombra;
}

export const SocialCard = ({
    saudacao, frase, corPrincipal,
    fonteFrase, fonteSaudacao, corFonteSaudacao, corFonteFrase,
    mostrarFundoSaudacao, tamanhoSaudacao, xSaudacao, ySaudacao,
    tamanhoFrase, xFrase, yFrase,
    imagemFundo, opacidadeFundo, blurFundo,
    sombraS, sombraF
}: SocialCardProps) => {

    const montarSombra = (s: Sombra) => s.ativa ? `${s.x}px ${s.y}px ${s.blur}px ${s.cor}` : 'none';

    return (
        <div id="post-social" className="w-[540px] h-[675px] bg-white relative overflow-hidden shadow-2xl border border-gray-100 flex flex-col items-center">
            {/* BARRA SUPERIOR DE MARCA */}
            <div className="absolute top-0 left-0 w-full h-4 z-50" style={{ backgroundColor: corPrincipal }} />

            {/* IMAGEM DE FUNDO COM FILTROS */}
            {imagemFundo && (
                <div
                    className="absolute inset-0 z-0 transition-all"
                    style={{
                        backgroundImage: `url(${imagemFundo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: opacidadeFundo,
                        filter: `blur(${blurFundo}px)`
                    }}
                />
            )}

            <div className="relative z-10 w-full h-full flex flex-col items-center pt-20 px-10 text-center">
                {/* TÍTULO (SAUDAÇÃO) */}
                <div
                    className={`px-6 py-2 transition-none flex items-center justify-center whitespace-nowrap ${mostrarFundoSaudacao ? 'rounded-full shadow-lg' : ''}`}
                    style={{
                        backgroundColor: mostrarFundoSaudacao ? corPrincipal : 'transparent',
                        color: corFonteSaudacao,
                        fontFamily: fonteSaudacao,
                        fontSize: `${tamanhoSaudacao}px`,
                        transform: `translate(${xSaudacao}px, ${ySaudacao}px)`,
                        textShadow: montarSombra(sombraS)
                    }}
                >
                    {saudacao}
                </div>

                {/* FRASE PRINCIPAL */}
                <h2
                    className="leading-[1.2] transition-none mt-10"
                    style={{
                        fontFamily: fonteFrase,
                        color: corFonteFrase,
                        fontSize: `${tamanhoFrase}px`,
                        transform: `translate(${xFrase}px, ${yFrase}px)`,
                        width: '100%',
                        wordBreak: 'break-word',
                        textShadow: montarSombra(sombraF)
                    }}
                >
                    "{frase}"
                </h2>
                <div className="w-16 h-1 rounded-full opacity-20 mt-8" style={{ backgroundColor: corPrincipal }} />
            </div>

            {/* RODAPÉ COM A LOGO FIXA (ALTERAÇÃO SOLICITADA) */}
            <div className="absolute bottom-10 w-full flex justify-center z-20">
                <img
                    src="/rhconectavagas.png"
                    className="h-24 w-auto object-contain"
                    alt="RH Conecta Vagas"
                />
            </div>
        </div>
    );
};