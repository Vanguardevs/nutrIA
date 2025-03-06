import styles from "./button.module.css";

const Button = ({title}) =>{

    // function saveBooks(){
    //     console.log("Olá mundo")
    // }
    
    //onclick para adicionar um evento no botão

    return(
        <div>
            <button>{title}</button>
        </div>
    );
}

export default Button;