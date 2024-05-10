/**
 * Génère 25 parties de champ et les ajoute à l'élément field-parts.
 */
function generateFields(){
    const field = document.querySelector("field-parts");
    for (let i = 0; i < 25; i++){
        const fieldpart = document.createElement("field-part");
        fieldpart.classList.add("grass");
        field.insertAdjacentElement("beforeend", fieldpart);
    }
}

/**
 * Gère l'événement de clic sur un outil.
 * Il supprime la classe active de l'outil actuellement actif et l'ajoute à l'outil cliqué.
 * @param {Event} event - L'événement de clic (ici un outils)
 */
function attachToolsEvent(event){
    const thistool = event.target;
    let tools = document.querySelector("tools");
    for (const tool of tools.children){
        if(tool.classList.contains("active")){
            tool.classList.remove("active");
        }
    }
    thistool.classList.add("active");
}

/**
 * Gère l'événement de clic sur une partie de champ.
 * Il change l'état de la partie de champ en fonction de l'outil actuellement actif.
 * @param {Event} event - L'événement de clic (ici une parcelle de champ)
 */
function ChangeField(event){
    const field = event.target;
    let state = "";
    let tools = document.querySelector("tools");
    for (let tool of tools.children){
        if(tool.classList.contains("active")){
            state = tool.id;
        }
        switch (state){
            case "tool-hoe": field.classList.add("farmland"), field.classList.remove("grass");break;
            case "tool-water": if(field.className == "farmland"){field.classList.add("hydrated"); field.dataset.hydrotime = 0;};break;
            case "tool-sow": if(field.classList[0] == "farmland" && (field.dataset.seed == 0 || field.dataset.seed == null)){field.dataset.seed = 1};break;
            case "tool-harvest": if(field.dataset.seed == 7){document.querySelector("#stock-wheat").innerHTML ++}; field.dataset.seed = 0; break;
        }
    }
}

/**
 * Connecte les événements de clic aux outils et aux parties de champ.
 */
function connectClickEvent() {
    const tool = document.querySelectorAll("tool");
    for(let i = 0; i < tool.length; i++){
        tool[i].addEventListener("click", attachToolsEvent);
    }
    const fields = document.querySelectorAll("field-part");
    for(let i = 0; i < fields.length; i++){
        fields[i].addEventListener("click", ChangeField);
    }
}

/**
 * change le champ aride en herbe avec une probabilité de 1%,
 * supprime la classe hydratée des parcelles de champ qui ont été hydratées 10 secondes sans être semées,
 * augmente la croissance des parcelles de champ qui sont semées et soit hydratées pour une probabilité de 30%,
   soit des terres arides pour une probabilité de 5%.
 */
function grow(){
    const fields = document.querySelectorAll("field-part")
    for(const field of fields){
        let proba = Math.floor(Math.random()*100);
        if(field.classList[1] == "hydrated" && field.dataset.hydrotime < 10) {
            field.dataset.hydrotime ++;
        }
        if((field.dataset.seed == 0 || field.dataset.seed == null) && field.className == "farmland" && proba == 1){
            field.classList.remove("farmland")
            field.classList.add("grass")
        }
        if(field.dataset.hydrotime == 10 && (field.dataset.seed == 0 || field.dataset.seed == null))
        {
            field.classList.remove("hydrated");
        }

        if(field.dataset.seed > 0 && field.dataset.seed < 7){
            if(field.classList[1] == "hydrated" && proba <= 30){
                field.dataset.seed ++;
            }
            else if(field.className == "farmland" && proba <= 5){
                field.dataset.seed ++;
            }
        }
    }
    window.setTimeout(grow,1000); // un seul setTimeout pour garantir que ce soit à chaque second
}

// Lorsque la fenêtre se charge, génère les champs, connecte les événements de clic et commence la simulation de croissance.
window.addEventListener("load", generateFields);
window.addEventListener("load", connectClickEvent);
window.addEventListener("load",grow);