import React from "react";
import style from "./createBook.module.css";

import Input from "../form/Input.jsx";
import Select from "../form/Select.jsx";
import Button from "../form/Button.jsx";

const CreateBook = () => {

    return(
        <section className={style.create_book_container}>

            <h1>Cadastro de livro: </h1>

            <Input type="text"
                name="txt_livro"
                id="tct_livro"
                placeholder="Digite o livro desejado: "
                // value={}
                text="Crie um livro: "
            />

            <Input type="text"
                name="txt_autor"
                id="tct_livro"
                placeholder="Digite o nome do autor: "
                // value={}
                text="Coloque o nome do autor: "
            />

            <Input type="text"
                name="txt_descricao"
                id="tct_livro"
                placeholder="Digite a descrição do livro escolhido: "
                // value={}
                text="Insira a descrição do livro: "
            />

            <Select
                name="slc_categorias"
                id="slc_categorias"
               text="Categorias do livro: "
            />

            <Button
                title="salvar"
            />

        </section>
    )
}

export default CreateBook;