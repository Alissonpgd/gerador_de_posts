import React from 'react';

interface VagaProps {
    titulo: string;
    subtitulo?: string;
    nomeEmpresa: string;
    requisitos: string[];
    emailContato: string;
    logoUrl?: string;
    imagemUrl?: string;
    corPrincipal?: string;
}

export const VagaCard = ({
    titulo, subtitulo, nomeEmpresa, requisitos, emailContato, logoUrl, imagemUrl, corPrincipal = "#660022"
}: VagaProps) => {
    return (
        <div
            id="post-vaga"
            className="w-[540px] h-[675px] bg-white shadow-2xl overflow-hidden flex flex-col relative font-sans border border-gray-100"
        >
            {/* BARRA SUPERIOR */}
            <div className="absolute top-0 left-0 w-full h-5 z-50" style={{ backgroundColor: corPrincipal }} />

            {/* CÍRCULO DECORATIVO */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full z-40 bg-gray-200/40 backdrop-blur-sm" />

            {/* IMAGEM DE FUNDO */}
            {imagemUrl && (
                <div className="absolute top-0 right-0 w-[60%] h-full z-0">
                    <img src={imagemUrl} alt="Vaga" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </div>
            )}

            {/* CONTEÚDO PRINCIPAL - Adicionamos pb-28 para proteger o rodapé */}
            <div className="relative z-30 p-10 flex flex-col h-full w-[78%] pt-14 pb-28">

                <div className="relative">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none italic" style={{ color: corPrincipal }}>
                        Vaga
                    </h1>
                    <div className="w-14 h-1 mt-1" style={{ backgroundColor: corPrincipal }} />
                </div>

                <div className="mt-6">
                    <h2 className="text-2xl font-extrabold leading-tight text-gray-900 uppercase tracking-tight break-words">
                        {titulo || "Título da Vaga"}
                    </h2>
                    <div className="mt-2 inline-block px-2 py-0.5 rounded text-white font-bold text-[10px] uppercase tracking-widest" style={{ backgroundColor: corPrincipal }}>
                        {nomeEmpresa || "Empresa Confidencial"}
                    </div>
                    {subtitulo && (
                        <p className="text-sm text-gray-500 italic mt-1 font-medium">{subtitulo}</p>
                    )}
                </div>

                {/* REQUISITOS - flex-1 faz ele ocupar o espaço que sobra, mas sem empurrar o resto pra fora */}
                <div className="mt-6 flex-1 overflow-hidden">
                    <h3 className="font-bold text-gray-800 border-b-2 mb-3 inline-block text-[12px] uppercase tracking-widest" style={{ borderColor: corPrincipal }}>
                        Requisitos:
                    </h3>
                    <ul className="space-y-1.5">
                        {requisitos.slice(0, 6).map((req, index) => ( // Limitamos a 6 itens para não quebrar o layout
                            <li key={index} className="flex items-start gap-2 text-gray-700 text-[13px] font-semibold leading-snug">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: corPrincipal }} />
                                <span className="line-clamp-2">{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* BOX DE CONTATO - Agora ele fica acima do rodapé com segurança */}
                <div className="mt-auto p-4 rounded-xl bg-gray-50/90 backdrop-blur-sm border-l-[5px] shadow-sm" style={{ borderLeftColor: corPrincipal }}>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">Enviar currículo para:</p>
                    <p className="text-[15px] font-bold text-gray-800 break-all leading-none">{emailContato || 'rh@empresa.com'}</p>
                </div>
            </div>

            {/* RODAPÉ FIXO */}
            <div className="absolute bottom-0 w-full p-5 bg-white flex justify-between items-end z-50 border-t border-gray-50 h-20">
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] leading-none">Recrutamento</span>
                    <span className="text-[11px] text-gray-600 font-bold uppercase italic mt-1">RH Conecta Vagas</span>
                </div>
                {logoUrl && (
                    <img src={logoUrl} alt="Logo" className="h-10 w-auto object-contain max-w-[120px]" />
                )}
            </div>
        </div>
    );
};