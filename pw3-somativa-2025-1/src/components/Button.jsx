import style from './button.module.css'

const Button = ({label})=>{
    return(
        <div className={style.buttonContainer}>
            <button>{label}</button>
        </div>
    )
}

export default Button