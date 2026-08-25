const filterButtons = document.querySelectorAll(".filter-btn");
const alerts = document.querySelectorAll(".alert-item");

filterButtons.forEach(button => {
    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        const filter = this.textContent.toLowerCase();

        alerts.forEach(alert => {

            if (filter === "all") {
                alert.style.display = "flex";
            } 
            else if (alert.dataset.type === filter) {
                alert.style.display = "flex";
            } 
            else {
                alert.style.display = "none";
            }

        });
    });
});