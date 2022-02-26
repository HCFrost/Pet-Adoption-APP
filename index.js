


class Cat {
    constructor(name){
        this.name = name;
        this.catStats = [];
    }

    addCatStats(breed, age, weight) {
        this.catStats.push(new CatStats(breed, age, weight));
    }
}


class CatStats {
    constructor(breed, age, weight){
        this.breed = breed;
        this.age = age;
        this.weight = weight;
    }
}

class CatService {
    static url = "https://cors-anywhere.herokuapp.com/https://62192b2081d4074e85a3c398.mockapi.io/cats"; //Insert CrudCrud link here!


    static getAllCats(){
        return $.get(this.url);
    }

    static getCat(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCat(cat) {
        console.log("Cat created");
        return $.post(this.url, cat);
    }

    static updateCat(cat) {
        return $.ajax=({ //If you get a cors error, try fetch instead.
            url: this.url + `/${cat._id}`,
            dataType: "json",
            data: JSON.stringify(cat),
            contentType: "application/json",
            type: "PUT"
        });
    }

    static deleteCat(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

class DOMManager {
    static cats;

    static getAllCats(){
        CatService.getAllCats().then(cats => this.render(cats));
    }

    static createCat(name){
        console.log("DomCat Called")
        CatService.createCat(new Cat(name))
            .then(() => {
                return CatService.getAllCats();
            })
            .then((cats) => this.render(cats));
    }

    static deleteCat(id){
        CatService.deleteCat(id)
            .then(() => {
                return CatService.getAllCats();
            })
            .then((cats) => this.render(cats));
    };

    static addStats(id) {
        for (let cat of this.cats) {
            if(cat._id == id) {
                cat.stats.push(new CatStats(`#${cat._id}-breed`).val(), cat.stats.push(new CatStats(`#${cat._id}-age`).val()), cat.stats.push(new CatStats(`#${cat._id}-weight`).val()));
                CatService.updateCat(cat)
                .then(() => {
                    return CatService.getAllCats();
                })
                .then((cats) => this.render(cats));
            }
        }
    }

    static deleteStats(catID, statID) {
        for(let cat of this.cats) {
            if(cat._id == catID) {
                for(let stat of cat.stats) {
                    if(stat._id == statID) {
                        cat.stats.splice(cat.stats.indexOf(stat), 1);
                        CatService.updateCat(cat)
                        .then(() => {
                            return CatService.getAllCats();
                        })
                        .then((cats) => this.render(cats));
                    }
                }
            }
        }
    }

    static render(cats) {
        this.cats = cats;
        $("#app-cat").empty();

        for(let cat of cats) {
            $('#app-cat').prepend(
                `<div id="${cat._id}" class="card">
                <div class="card-header">
                    <h2>${cat.name}</h2>
                    <button class="btn btn-primary" onclick="DOMManager.deleteCat("${cat._id}")">Delete</button>

                </div>
                <div class="card-body">
                 <div class="card">
                    <div class="row">
                        <div class="col-sm">
                        <input type="text" id="${cat._id}-breed" class="form-control" placeholder="Cat Breed">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${cat._id}-age" class="form-control" placeholder="Cat Age">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${cat._id}-weight" class="form-control" placeholder="Cat Weight (lb)">
                        </div>
                    </div>
                    <button id="${cat._id}-add-stats" onclick="DOMManager.addStats("${cat._id}")" class="btn btn-primary form-control">Add Pet Stats</button>
                 </div>
                </div>
                </div> <br>`
            );
            for(let stat of cat.stats) {
                $(`${cat._id}`).find(".card-body").append(
                    `<p>
                    <span id="breed-${stat._id}"><strong>Name: </strong> ${stat.name} </span>
                    <span id="age-${stat._id}"><strong>Age: </strong> ${stat.age} </span>
                    <span id="weight-${stat._id}"><strong>Name: </strong> ${stat.weight} </span>
                    <button class="btn btn-warning" onclick="DOMManager.deleteStats("${cat._id}", "${stat._id}")">Delete Pet Stats</button>
                    `
                )
            }
        }
    }
};

$("#create-new-cat").click(() => {
    console.log("Testing to see if button works.");
    DOMManager.createCat($("#new-cat-name").val());
    $("#new-cat-name").val("");
});




DOMManager.getAllCats();





