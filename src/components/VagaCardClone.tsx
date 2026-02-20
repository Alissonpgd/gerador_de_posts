import React from 'react';

interface CloneProps {
    corPrincipal: string;
    imagemSujeito?: string;
    logoMarca?: string;
    logoEmpresa?: string;
    posX: number; posY: number; escala: number; brilho: number;
}

export const VagaCardClone = ({
    corPrincipal, imagemSujeito, logoMarca, logoEmpresa,
    posX, posY, escala, brilho
}: CloneProps) => {
    return (
        <div className="w-[540px] h-[675px] relative overflow-hidden shadow-2xl bg-white border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-5 z-50" style={{ backgroundColor: corPrincipal }} />
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full z-0 bg-gray-100/50 backdrop-blur-sm" />

            {imagemSujeito && (
                <img
                    src={imagemSujeito}
                    className="absolute z-10"
                    style={{
                        bottom: `${posY}px`, right: `${posX}px`,
                        transform: `scale(${escala})`, transformOrigin: 'bottom right',
                        filter: `brightness(${brilho}) contrast(1.1)`,
                        width: 'auto', height: '90%'
                    }}
                />
            )}

            <div className="absolute top-16 left-10 z-20">
                <h1 className="text-6xl font-black uppercase tracking-tighter italic" style={{ color: corPrincipal }}>Vaga</h1>
                <div className="w-14 h-1 mt-1" style={{ backgroundColor: corPrincipal }} />
            </div>

            <div className="absolute bottom-0 w-full p-6 bg-white flex justify-between items-end z-50 border-t border-gray-50 h-24">
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-black uppercase tracking-[0.3em]">Recrutamento</span>
                    <span className="text-[11px] text-gray-600 font-bold uppercase italic mt-1 font-sans">RH Conecta Vagas</span>
                </div>
                <div className="flex gap-4 items-center">
                    {logoMarca && <img src={logoMarca} className="h-10 w-auto object-contain" />}
                    {logoEmpresa && <img src={logoEmpresa} className="h-10 w-auto object-contain border-l pl-4 border-gray-100" />}
                </div>
            </div>
        </div>
    );
};