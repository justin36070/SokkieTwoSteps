let allMoves = [];

$(document).ready(function () {
    console.log("custom.js loaded");

    // Load all moves once
    $.getJSON("data/moves.json")
        .done(function (data) {
            allMoves = data;
            displayMoves(allMoves);
            populateFilters();
        })
        .fail(function () {
            $("#movesList").html("<p style='color:red'>Could not load moves.json</p>");
        });

    // Search
    $("#searchInput").on("input", filterMoves);

    // Filters
    $("#danceTypeFilter, #difficultyFilter, #categoryFilter").on("change", filterMoves);

    // Random button
    $("#randomBtn").on("click", function () {
        if (allMoves.length > 0) {
            const random = allMoves[Math.floor(Math.random() * allMoves.length)];
            window.location.href = `move-details.html?id=${random.id}`;
        }
    });
});

function displayMoves(moves) {
    const container = $("#movesList");
    container.empty();

    if (moves.length === 0) {
        container.html("<p>No moves match your filters.</p>");
        return;
    }

    moves.forEach(move => {
        // Detect if it's a video (MP4 or YouTube) or old GIF
        const isMP4 = move.media.includes(".mp4");
        const isYouTube = move.media.includes("youtube");

        let mediaHtml = "";

        if (isYouTube) {
            mediaHtml = `<iframe src="${move.media}" frameborder="0" allowfullscreen></iframe>`;
        } else if (isMP4) {
            // Small looping video preview on the main page
            mediaHtml = `
                <video class="img-fluid rounded" loop muted playsinline preload="metadata" style="max-height:250px; width:100%; object-fit:cover;">
                    <source src="${move.media}" type="video/mp4">
                </video>
            `;
        } else {
            // Fallback for old GIF links
            mediaHtml = `<img src="${move.media}" alt="${move.name}" class="img-fluid rounded" style="max-height:250px;">`;
        }

        const card = `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-img-top bg-light text-center p-3">
                        ${mediaHtml}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${move.name}</h5>
                        <p class="card-text"><strong>${move.danceType}</strong> • ${move.difficulty}</p>
                        <p class="card-text flex-grow-1">${move.description}</p>
                        <p class="text-muted small"><em>${move.tips}</em></p>
                        <a href="move-details.html?id=${move.id}" class="btn btn-primary mt-auto">View Details →</a>
                    </div>
                </div>
            </div>`;
        container.append(card);
    });

    // Auto-play videos on hover (optional but looks amazing)
    $(".card video").on("mouseenter", e => e.target.play());
    $(".card video").on("mouseleave", e => e.target.pause());
}

function filterMoves() {
    let filtered = allMoves;

    // Search
    const term = $("#searchInput").val().toLowerCase();
    if (term) {
        filtered = filtered.filter(m =>
            m.name.toLowerCase().includes(term) ||
            m.description.toLowerCase().includes(term) ||
            m.tips.toLowerCase().includes(term)
        );
    }

    // Filters
    const type = $("#danceTypeFilter").val();
    const diff = $("#difficultyFilter").val();
    const cat  = $("#categoryFilter").val();

    if (type) filtered = filtered.filter(m => m.danceType === type);
    if (diff) filtered = filtered.filter(m => m.difficulty === diff);
    if (cat)  filtered = filtered.filter(m => m.category === cat);

    displayMoves(filtered);
}

function populateFilters() {
    const types = [...new Set(allMoves.map(m => m.danceType))].sort();
    const diffs = [...new Set(allMoves.map(m => m.difficulty))].sort();
    const cats  = [...new Set(allMoves.map(m => m.category))].sort();

    ["danceTypeFilter", "difficultyFilter", "categoryFilter"].forEach(id => {
        const select = $(`#${id}`);
        select.append('<option value="">All</option>');
        const values = id === "danceTypeFilter" ? types : id === "difficultyFilter" ? diffs : cats;
        values.forEach(val => select.append(`<option value="${val}">${val}</option>`));
    });
}