$(document).ready(function () {
    console.log("custom.js loaded – loading moves...");

    // Load moves from JSON
    $.getJSON("data/moves.json")
        .done(function (moves) {
            displayMoves(moves);
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error("Failed to load moves.json:", textStatus, error);
            $("#movesList").html("<p style='color:red'>Error: Could not load dance moves. Check console.</p>");
        });

    function displayMoves(moves) {
        const container = $("#movesList");
        container.empty();

        if (moves.length === 0) {
            container.html("<p>No moves found.</p>");
            return;
        }

        moves.forEach(move => {
            const mediaHtml = move.media.includes("youtube.com") || move.media.includes("youtu.be")
                ? `<iframe width="100%" height="315" src="${move.media}" frameborder="0" allowfullscreen></iframe>`
                : move.media.includes("imgur.com")
                    ? `<img src="${move.media.replace('gallery/', 'a/')}.gif" alt="${move.name}" style="max-width:100%;">`
                    : `<img src="${move.media}" alt="${move.name}" style="max-width:100%;">`;

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
                            <a href="move-details.html?id=${move.id}" class="btn btn-primary mt-auto">View Details</a>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    }

    // Simple search
    $("#searchInput").on("input", function () {
        const term = $(this).val().toLowerCase();
        $.getJSON("data/moves.json", function (moves) {
            const filtered = moves.filter(m =>
                m.name.toLowerCase().includes(term) ||
                m.description.toLowerCase().includes(term) ||
                m.danceType.toLowerCase().includes(term)
            );
            displayMoves(filtered);
        });
    });
});