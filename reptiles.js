class Reptile {
    constructor(name){
        this.name = name;
        this.reptileStats = [];
    }

    addReptileStats(breed, age, weight) {
        this.reptileStats.push(new ReptileStats(breed, age, weight));
    }
}

class ReptileStats {
    constructor(breed, age, weight){
        this.breed = breed;
        this.age = age;
        this.weight = weight;
    }
}

class ReptileService {
    static url = "https://cors-anywhere.herokuapp.com/https://621acaa7faa12ee450fea912.mockapi.io/Reptiles";

    static getAllReptiles(){
        return $.get(this.url);
    }

    static getReptile(id) {
        return $.get(this.url + `/${id}`);
    }

    static createReptile(reptile) {
        console.log("Reptile created");
        return $.post(this.url, reptile);
    }

    static updateReptile(reptile) {
        return $.ajax=({
            url: this.url + `/${reptile.id}/Stats`,
            dataType: "json",
            data: JSON.stringify(reptile),
            contentType: "application/json",
            type: "PUT"
        });
    }

    static deleteReptile(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

class DOMManager {
    static reptiles;

    static getAllReptiles(){
        ReptileService.getAllReptiles().then(reptiles => this.render(reptiles));
    }

    static createReptile(name){
        ReptileService.createReptile(new Reptile(name))
            .then(() => {
                return ReptileService.getAllReptiles();
            })
            .then((reptiles) => this.render(reptiles));
    }

    static deleteReptile(id){
        ReptileService.deleteReptile(id)
            .then(() => {
                return ReptileService.getAllReptiles();
            })
            .then((reptiles) => this.render(reptiles));
    };

    static addStats(id) {
        for (let reptile of this.reptiles) {
            if(reptile.id == id) {
                reptile.push(new ReptileStats(`#${reptile.id}-breed`).value(), reptile.stats.push(new ReptileStats(`#${reptile.id}-age`).val()), reptile.stats.push(new ReptileStats(`#${reptile.id}-weight`).val()));
                ReptileService.updateReptile(reptile)
                .then(() => {
                    return ReptileService.getAllReptiles();
                })
                .then((reptiles) => this.render(reptiles));
            }
        }
    }
    
    static deleteStats(reptileID, statID) {
        for(let reptile of this.reptiles) {
            if(reptile._id == reptileID) {
                for(let stat of reptile.stats) {
                    if(stat._id == statID) {
                        reptile.stats.splice(reptile.stats.indexOf(stat), 1);
                        ReptileService.updateReptile(reptile)
                        .then(() => {
                            return ReptileService.getAllReptiles();
                        })
                        .then((reptiles) => this.render(reptiles));
                    }
                }
            }
        }
    }

    static render(reptiles) {
        this.reptiles = reptiles;
        $("#app-reptile").empty();

        for(let reptile of reptiles) {
            $('#app-reptile').prepend(
                `<div id="${reptile.id}" class="card">
                <div class="card-header">
                    <h2>${reptile.name}</h2>
                    <button class="btn btn-primary" onclick="DOMManager.deleteReptile('${reptile.id}')">Delete</button>

                </div>
                <div class="card-body">
                 <div class="card">
                    <div class="row">
                        <div class="col-sm">
                        <input type="text" id="${reptile.id}-breed" class="form-control" placeholder="Reptile Breed">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${reptile.id}-age" class="form-control" placeholder="Reptile Age">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${reptile.id}-weight" class="form-control" placeholder="Reptile Weight (lb)">
                        </div>
                    </div>
                    <button id="${reptile.id}-add-stats" onclick="DOMManager.addStats('${reptile.id}')" class="btn btn-primary form-control">Add Pet Stats</button>
                 </div>
                </div>
                </div> <br>`
            );
            var map = new Map
            map.set(reptile, reptile.stats)
            for(let stat of map.keys()) {
                $(`${reptile.id}`).find(".card-body").append(
                    `<p>
                    <span id="breed-${stat.id}"><strong>Name: </strong> ${reptile.breed} </span>
                    <span id="age-${stat.id}"><strong>Age: </strong> ${reptile.age} </span>
                    <span id="weight-${stat.id}"><strong>Name: </strong> ${reptile.weight} </span>
                    <button class="btn btn-warning" onclick="DOMManager.deleteStats("${reptile._id}", "${stat._id}")">Delete Pet Stats</button>
                    `
                )
            }
        }
    }
};

$("#create-new-reptile").click(() => {
    DOMManager.createReptile($("#new-reptile-name").val());
    $("#new-reptile-name").val("");
});

DOMManager.getAllReptiles();





