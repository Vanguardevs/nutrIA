import style from './bookCards.module.css'
import Button from './Button.jsx'

const BookCards = ({title, autor, imagem})=>{
    return(
        <div className={style.bookCards}>

            <h3 className={style.title}>{title}</h3>

            <p className={style.autor}>{autor}</p>

            <img src={imagem} alt='Uma imagem' className={style.imagem}/>

            <Button label="DETALHE"/>
            
        </div>
    )
}

export default BookCards