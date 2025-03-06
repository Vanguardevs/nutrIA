import styles from './home.module.css';

const Home = () =>{
    return(
        <section className={styles.home_container}>
            <h1>Bem vindo ao WEB APP<span>LIBRI</span></h1>
            <p>Comece a gerenciar os seus livros agora mesmo!</p>
            <img className={styles.home_container}src="./book_home.jpeg" alt="" />
        </section>
    );
}

export default Home;