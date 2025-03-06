import styles from "./select.module.css"

const Select = ({text, name, id}) => {
    return(
        <div className={styles.form_control}>

            <label htmlFor={name}>{text}</label>

            <select name={name} id={id}>

                <option value=""> Selecione uma categoria</option>

                <option value="">Ficção cientifica</option>

                <option value="">Fantasia Heróica</option>

                <option value="">Suspense</option>

                <option value="">Terror</option>

            </select>

        </div>
    );
}

export default Select;