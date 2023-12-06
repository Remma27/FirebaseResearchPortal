class Menu extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">
            <img src="images/logo.svg" alt="" width="50%"  class="d-inline-block align-text-top">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="index.html">Home</a>
                </li>
                <li class="nav-item dropdown ml-2"> <!-- Agregamos la clase ml-2 para agregar un margen a la izquierda -->
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="authDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Authentication
                        </a>
                        <div class="dropdown-menu" aria-labelledby="authDropdown">
                            <a class="dropdown-item" href="login.html">Login</a>
                            <a class="dropdown-item" href="signup.html">Sign Up</a>
                            <a class="dropdown-item" onclick="logout()">Log Out</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item mr-14">
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="optionsDropdown" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Options
                        </a>
                        <div class="dropdown-menu" aria-labelledby="optionsDropdown">
                            <a class="dropdown-item" href="addInvestigation.html">Add Project</a>
                            <a class="dropdown-item" href="researchWork.html">Investigations</a>
                            <a class="dropdown-item" href="showInvestigation.html">Search Project</a>
                            <a class="dropdown-item" href="student.html">Add Student</a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</nav>`;
    }
}

customElements.define('menu-component', Menu);
