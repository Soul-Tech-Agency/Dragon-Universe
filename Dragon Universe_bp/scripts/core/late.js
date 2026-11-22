// Ligação tardia (O4.0 de planos/O4_0_DETALHE.md): nomes do núcleo usados por código que vem ANTES da declaração no
// bundle. Quem declara registra um getter logo depois da declaração; quem usa lê late.<nome> na hora de chamar. Sem
// import em ciclo e sem efeito na carga. Getter (não cópia): continua certo se o nome for reatribuído.
// configurable: false — registrar o mesmo nome duas vezes lança erro, o que pega getter duplicado na carga.
export const late = {};
export function bindLate(name, get) {
  Object.defineProperty(late, name, { get, enumerable: true, configurable: false });
}
