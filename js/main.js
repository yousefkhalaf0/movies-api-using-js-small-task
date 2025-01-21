var container = document.querySelector('.mainCard');
var apiData = [];

//APIs
function GetData(type) {
    container.innerHTML = '';

    type = document.getElementById('selector').value;
    var id = document.getElementById('typeId').value;
    var xhr = new XMLHttpRequest();
    var token = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZWM3YTEyMGVmYzBmMjYwN2M2NmY0M2FjOTZlNTE4NyIsIm5iZiI6MTczNDY5OTE0OS42MDcsInN1YiI6IjY3NjU2ODhkMzMwYmNlNmVjOTkwZDkzYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.esHqUVs2EKpxNE00BUZOjw-aOb2Ed7d9qJDEkisIR6I'
    var url = id ?
        `https://api.themoviedb.org/3/${type}/${id}?language=en-US` :
        `https://api.themoviedb.org/3/trending/${type}/day?language=en-US`;

    xhr.open("GET", url);
    //searched for this
    xhr.setRequestHeader("Authorization", token);
    xhr.onload = function () {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            //searched for the base url of the image
            if (id) {
                apiData = [{
                    fullPosterPath: response.poster_path
                        ? `https://image.tmdb.org/t/p/original${response.poster_path}`
                        : response.profile_path
                            ? `https://image.tmdb.org/t/p/original${response.profile_path}`
                            : null,
                    titleOrName: response.title || response.name,
                    overview: response.overview,
                }];
            } else {
                apiData = response.results.map(item => ({
                    fullPosterPath: type === "person" ?
                        (item.profile_path ? `https://image.tmdb.org/t/p/original${item.profile_path}` : null) :
                        (item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : null),
                    titleOrName: (type === "person" || type === "tv") ? item.name : item.title,
                    overview: item.overview,
                }));
            }
            //testing in console => done
            // console.log('Returned data:', apiData);
            displayCards();
        }
    };
    xhr.send();
}

//from previous lab.
function displayCards() {
    apiData.forEach((card, index) => {
        var currentIndex = index;

        var cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.style.backgroundImage = `url(${card.fullPosterPath})`;

        var infoDiv = document.createElement("div");
        infoDiv.classList.add("info");

        var title = document.createElement("h2");
        title.textContent = card.titleOrName || "No Title or Name";

        var description = document.createElement("p");
        description.textContent = card.overview || "No Overview";

        infoDiv.appendChild(title);
        infoDiv.appendChild(description);
        cardDiv.appendChild(infoDiv);
        container.appendChild(cardDiv);

        cardDiv.addEventListener('click', function () {
            var displayDiv = document.createElement('div');
            displayDiv.classList.add("display");
            displayDiv.style.backgroundImage = `url(${card.fullPosterPath})`;

            var overlayDiv = document.createElement('div');
            overlayDiv.classList.add("overlay");

            container.appendChild(overlayDiv);
            container.appendChild(displayDiv);

            var leftButton = document.createElement('button');
            leftButton.textContent = '<';
            leftButton.classList.add('btns', 'left');
            var rightButton = document.createElement('button');
            rightButton.textContent = '>';
            rightButton.classList.add('btns', 'right');

            var closeButton = document.createElement('button');
            closeButton.textContent = "X";
            closeButton.classList.add('close-btn');

            displayDiv.appendChild(leftButton);
            displayDiv.appendChild(rightButton);
            displayDiv.appendChild(closeButton);

            function updateImage() {
                displayDiv.style.backgroundImage = `url(${apiData[currentIndex].fullPosterPath})`;
            }

            //searched for this
            function changeImage(direction) {
                currentIndex = (currentIndex + direction + apiData.length) % apiData.length;
                updateImage();
            }

            leftButton.addEventListener('click', function () {
                changeImage(-1)
            });
            rightButton.addEventListener('click', function () {
                changeImage(1)
            });

            closeButton.addEventListener('click', function () {
                container.removeChild(displayDiv);
                container.removeChild(overlayDiv);
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === "Escape") {
                    container.removeChild(displayDiv);
                    container.removeChild(overlayDiv);
                } else if (e.key === "ArrowLeft") {
                    changeImage(-1);
                } else if (e.key === "ArrowRight") {
                    changeImage(1);
                }
            });
        });
    });
}

GetData("all");

document.getElementById('searchBtn').addEventListener('click', function () {
    GetData();
});
// document.querySelector('#selector').addEventListener('change', function (e) {
//     var selectedType = e.target.value;
//     GetData(selectedType);
// });