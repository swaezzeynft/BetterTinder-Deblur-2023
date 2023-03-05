async function getTeasers() {
    const links = document.querySelectorAll("body");
    const modals = document.querySelectorAll(".modal");
    const teasers = await getTeasersByAPI();
    const teaserEls = document.querySelectorAll('.Expand.enterAnimationContainer > div:nth-child(1)');
    for (let i2 = 0; i2 < links.length; i2++) links[i2].removeAttribute("href");
    for (var i3 = 0; i3 < modals.length; i3++)  modals[i3].remove();

    for (let i = 0; i < teaserEls.length; ++i) {
        const teaser = teasers[i];
        const teaserEl = teaserEls[i];
        const teaserImage = teaser.user.photos[0].url;

        let unblurredImage = teaserImage;

        if (teaserImage.includes('unknown')) continue;

        if (teaserImage.includes('images-ssl')) {
            const userId = teaserImage.slice(32, 56);
            const user = await fetchUser(userId);

            unblurredImage = user.photos[0].url;
            //calc birthdate
            const birthdateStr = user.birth_date;
            const birthdate = new Date(birthdateStr);
            const today = new Date();
            const ageInMilliseconds = today - birthdate;
            const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365);

            setTeaserName(user.name, Math.floor(ageInYears), user._id.replace("\n", ""));
        }

        teaserEl.style.backgroundImage = `url(${unblurredImage})`;
    }
}


function setTeaserName(name, age, userID) {
    const infoEl = document.createElement('div');
    infoEl.classList.add("Tsh($tsh-s)", "D(f)", "Fx($flx1)", "Fxd(c)", "Miw(0)");
    const teaserNameEl = document.createElement("div");
    teaserNameEl.classList.add("Fz($m)--ml", "Fz($s)--s", "Fw($semibold)", "W(100%)", "D(f)", "Fxd(c)");
    teaserNameEl.style.transform = "translateY(0px)";
    const nameContainerEl = document.createElement("div");
    nameContainerEl.classList.add("D(f)", "Ai(c)", "Miw(0)");
    const nameEl = document.createElement("span");
    nameEl.setAttribute("itemprop", "name");
    nameEl.innerText = name;
    const ageEl = document.createElement("span");
    ageEl.setAttribute("itemprop", "age");
    ageEl.innerText = age;
    const buttonEl = document.createElement("button");

    buttonEl.classList.add("magic_button_" + name);
    buttonEl.innerText = "SendLike";

    buttonEl.addEventListener("click", function () {
        alert("Send Like to " + userID);
        sendLike(userID);
    });

    nameContainerEl.append(nameEl, document.createTextNode(","), ageEl);
    teaserNameEl.append(nameContainerEl, buttonEl);
    infoEl.appendChild(teaserNameEl);
    document.querySelectorAll('.Expand.enterAnimationContainer > div:nth-child(2)').forEach((el) => {
        el.appendChild(infoEl);
    });
}


async function getTeasersByAPI() {
    return fetch('https://api.gotinder.com/v2/fast-match/teasers', {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android',
        },
    })
        .then((res) => res.json())
        .then((res) => res.data.results);
}

async function fetchUser(id) {
    return fetch(`https://api.gotinder.com/user/${id}`, {
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android',
        },
    })
        .then((res) => res.json())
        .then((res) => res.results);
}


async function sendLike(id) {
    var sex = id.replace("\n", "");
    return fetch(`https://api.gotinder.com/like/${sex}`, {
        method: 'POST',
        headers: {
            'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken'),
            platform: 'android',
        },
    })
        .then((res) => res.json())
        .then((res) => res.results);
}


getTeasers();