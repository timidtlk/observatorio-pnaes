CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1º: Configuração dos membros (Insira os membros que você quer que inicializem com a aplicação)

INSERT INTO members 
    (id, name, description, email, lattes, login, password, role, photo_url) 
VALUES 
(
    gen_random_uuid(),
    'Ana', 
    'Graduada em biblioteconomia', 
    'ana@emailfalso.com', 
    'https://lattes.cnpq.br/ana',
    'ana',
    '',
    'MEMBER',
    'ana.jpg'
);