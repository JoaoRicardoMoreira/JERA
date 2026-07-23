# Task 003 - ESLint e Prettier

## Objetivo

Configurar ESLint e Prettier para padronizacao de codigo.

---

## Contexto

A spec exige ESLint + Prettier e convencoes consistentes. Esta task garante qualidade antes da criacao de codigo de negocio.

---

## Dependencias

* Task 001

---

## Arquivos envolvidos

Criar

* `.eslintrc.js`
* `.prettierrc`
* `.prettierignore`

Modificar

* `package.json`

---

## Escopo

* [ ] Configurar ESLint para TypeScript e NestJS.
* [ ] Configurar Prettier.
* [ ] Adicionar scripts de lint e format.
* [ ] Garantir padrao de arquivos em kebab-case por convencao documentada.
* [ ] Rodar lint e format na base inicial.

---

## Fora do escopo

* Nao implementar regras customizadas complexas.
* Nao criar modulos.
* Nao alterar arquitetura.

---

## Criterios de aceite

* `npm run lint` executa.
* `npm run format` executa.
* `npm run build` continua passando.

---

## Arquitetura envolvida

* Padroes de codigo
* Convencoes de imports
* Qualidade estatica

---

## Observacoes

As regras devem apoiar a spec sem bloquear produtividade com restricoes nao previstas.

---

## Proxima Task

Task 004 - ConfigModule e variaveis de ambiente
