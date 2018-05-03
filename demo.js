

class Demo {
  constructor () {
    this.rootEl = $l('.beer');
  }

  createTitle () {
    this.rootEl.append("<div class='title-image'></div>");
    $l('.title-image').append("<div class='beer-image'><img src='./beer.png'></img></div>");
    $l('.title-image').append("<div class='title'>Hops to It</div>");
  }

  createForm () {
    const classes = ["abv_gt", "abv_lt", "ibu_gt", "ibu_lt", "ebc_gt",
    "ebc_lt", "beer_name", "yeast", "brewed_before", "brewed_after",
    "hops", "malt", "food"];
    this.rootEl.append("<form class='form'>");
    classes.forEach(el => {
      $l('.form').append(`<div class=${el}></div>`);
    });
    const labels = ["Min ABV", "Max ABV", "Min IBU", "Max IBU",
    "Min EBC", "Max EBC", "Beer Name", "Yeast", "Brewed Before (mm-yyyy)",
    "Brewed After (mm-yyyy)", "Hops", "Malt", "Food Pairing"];
    for (let i = 0; i< labels.length; i++) {
      let position = $l('.form').find('div').nodes;
      $l(position[i]).append(`<label>${labels[i]}</label>`);
    }
    $l('.form').find('div').append("<input type='text'></input>");
    $l('.form').append("<input type='submit' value='search' class='search-button'></input>");
  }

  createBeerList () {
    this.rootEl.append("<div class='display'></div>");
    $l('.display').append("<ul class ='beer-list' id='beer-list'>");
    $l('.display').append("<div class='info'></div>");
    this.rootEl.append('<div class="return"><a href="#">Back to Top</a></div>');
    let beerList = [];
    $l('.form').on('submit', (e) =>{
      e.preventDefault();
      let dataVals = {};
      $l('.form').find('div').nodes.forEach(node => {
        let k = $l(node).attr("class");
        let v = $l(node).find('input').val();
        v = v.split(" ").join("_");
        if (v !== "") dataVals[k] = v;
      });
      this.fetchData(dataVals, beerList);
    });
  }

  fetchData(dataVals, beerList) {
    const thisClass = this;
    $l.ajax({
      type: 'GET',
      data: dataVals,
      url: "https://api.punkapi.com/v2/beers",
      success(data) {
        beerList = JSON.parse(data);
        $l('.beer-list').find('li').remove();
        beerList.forEach(beer =>{
          $l('.beer-list').append(`<li id=${beer.id}>${beer.name}</li>`);
        });
        $l('.form').find("[type='text']").val('');
        $l('.info').empty();
        $l('.info').removeClass('selected');
        document.getElementById('beer-list').scrollIntoView({behavior: 'smooth'});
        thisClass.displayBeerInfo(beerList);
      },
      error() {
        console.error("An error occurred.");
      },
    });
  }

  displayBeerInfo (beerList) {
    $l('.beer-list').on('click', (e) => {
      const target = e.target.id;
      const selectedBeer = beerList.find(el => {
        return el.id === parseInt(target);
      });
      if (selectedBeer) {
        $l('.info').empty();
        $l('.info').addClass("selected");
        $l('.info').append(`<li><img class="beer-image" src=${selectedBeer.image_url}/></li>`);
        $l('.info').append(`<li>${selectedBeer.description}</li>`);
        $l('.info').append(`<li>ABV: ${selectedBeer.abv}</li>`);
        $l('.info').append(`<li>Food Pairing: ${selectedBeer.food_pairing}</li>`);
        $l('.info').append(`<li>Brewers Tips: ${selectedBeer.brewers_tips}</li>`);
      }
    });
  }

  run() {
    this.createTitle();
    this.createForm();
    this.createBeerList();
  }
}



$l( () => {
  new Demo().run();
});
