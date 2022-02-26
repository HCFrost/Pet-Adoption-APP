class Dog {
    constructor(name){
        this.name = name;
        this.dogStats = [];
    }

    addDogStats(breed, age, weight) {
        this.dogStats.push(new DogStats(breed, age, weight));
    }
}


class DogStats {
    constructor(breed, age, weight){
        this.breed = breed;
        this.age = age;
        this.weight = weight;
    }
}

class DogService {
    static url = "https://crudcrud.com/api/d40cbb6ad5a44e7d81ff0dc1e06c1090/dogs" //Insert CrudCrud link here!

    static getAllDogs(){
        return $.get(this.url);
    }

    static getDog(id) {
        return $.get(this.url + `/${id}`);
    }

    static createDog(dog) {
        //console.log("Dog created");
        return $.post(this.url, dog);
    }

    static updateDog(dog) {
        return $.ajax({ //If you get a cors error, try fetch instead.
            url: this.url + `/${dog._id}`,
            dataType: "json",
            data: JSON.stringify(dog),
            contentType: "application/json",
            type: "PUT"
        });
    }

    static deleteDog(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: "DELETE"
        });
    }
}

class DOMManager {
    static dogs;

    static getAllDogs(){
        DogService.getAllDogs().then(dogs => this.render(dogs));
    }

    static createDog(name){
        //console.log("DomDog Called")
        DogService.createDog(new Dog(name))
            .then(() => {
                return DogService.getAllDogs();
            })
            .then((dogs) => this.render(dogs));
    }

    static deleteDog(id){
        DogService.deleteDog(id)
            .then(() => {
                return DogService.getAllDogs();
            })
            .then((dogs) => this.render(dogs));
    }

    static addStats(id) {
        for (let dog of this.dogs) {
            if(dog._id == id) {
                dog.stats.push(new DogStats(`#${dog._id}-breed`).val(), dog.stats.push(new DogStats(`#${dog._id}-age`).val()), dog.stats.push(new DogStats(`#${dog._id}-weight`).val()));
                DogService.updateDog(dog)
                .then(() => {
                    return DogService.getAllDogs();
                })
                .then((dogs) => this.render(dogs));
            }
        }
    }

    static deleteStats(dogID, statID) {
        for(let dog of this.dogs) {
            if(dog._id == dogID) {
                for(let stat of dog.stats) {
                    if(stat._id == statID) {
                        dog.stats.splice(dog.stats.indexOf(stat), 1);
                        DogService.updateDog(dog)
                        .then(() => {
                            return DogService.getAllDogs();
                        })
                        .then((dogs) => this.render(dogs));
                    }
                }
            }
        }
    }

    static render(dogs) {
        this.dogs = dogs;
        $("#app-dog").empty();

        for(let dog of dogs) {
            $('#app-dog').prepend(
                `<div id="${dog._id}" class="card">
                <div class="card-header">
                    <h2>${dog.name}</h2>
                    <button class="btn btn-primary" onclick="DOMManager.deleteDog("${dog._id}")">Delete</button>

                </div>
                <div class="card-body">
                 <div class="card">
                    <div class="row">
                        <div class="col-sm">
                        <input type="text" id="${dog._id}-breed" class="form-control" placeholder="Dog Breed">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${dog._id}-age" class="form-control" placeholder="Dog Age">
                        </div>
                        <div class="col-sm">
                        <input type="text" id="${dog._id}-weight" class="form-control" placeholder="Dog Weight (lb)">
                        </div>
                    </div>
                    <button id="${dog._id}-add-stats" onclick="DOMManager.addStats("${dog._id}")" class="btn btn-primary form-control">Add Pet Stats</button>
                 </div>
                </div>
                </div> <br>`
            );
            for(let stat of dog.stats) {
                $(`${dog._id}`).find(".card-body").append(
                    `<p>
                    <span id="breed-${stat._id}"><strong>Name: </strong> ${stat.name} </span>
                    <span id="age-${stat._id}"><strong>Age: </strong> ${stat.age} </span>
                    <span id="weight-${stat._id}"><strong>Name: </strong> ${stat.weight} </span>
                    <button class="btn btn-warning" onclick="DOMManager.deleteStats("${dog._id}", "${stat._id}")">Delete Pet Stats</button>
                    `
                )
            }
        }
    }
}

$("#create-new-dog").click(() => {
    //console.log("Testing to see if button works.");
    DOMManager.createDog($("#new-dog-name").val());
    $("#new-dog-name").val("");
});




DOMManager.getAllDogs();