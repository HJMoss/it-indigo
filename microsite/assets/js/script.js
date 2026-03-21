// 1. Scroll Effect Logic
window.addEventListener("scroll", function () {
    const header = document.querySelector(".header-content");
    // Only run if the header exists on the page
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
});

// 2. Calculator Logic
$(document).ready(function () {

    $('#Calculate').on('click', function () {
        // Clear previous results/errors
        $('.error').text('');
        $('#ResultDisplay').text('');
        $('#ResultContainer').hide();

        // Get Values
        const weight = parseFloat($('#weight').val());
        const ageWeeks = parseInt($('#age').val());
        const activityLevel = $('input[name="activity"]:checked').val();

        let valid = true;

        // Validation
        if (isNaN(weight) || weight <= 0) {
            $('#weightError').text('Please enter a valid weight in grams');
            valid = false;
        }
        if (isNaN(ageWeeks) || ageWeeks <= 0) {
            $('#ageError').text('Please enter age in weeks');
            valid = false;
        }
        if (!activityLevel) {
            $('#activityError').text('Please select activity level');
            valid = false;
        }

        if (!valid) return;

        /*
           - Babies (under 12 weeks): ~7% of body weight
           - Adults: ~4% of body weight
           - High activity: 1.1x multiplier
        */
        
        let percentage = (ageWeeks < 12) ? 0.07 : 0.04; 
        let foodAmount = weight * percentage;

        if (activityLevel === "high") {
            foodAmount *= 1.1;
        }

        // Display Result
        $('#ResultDisplay').text(`${foodAmount.toFixed(1)} grams`);
        $('#ResultContainer').fadeIn(); 
    });

    // Clear Button Logic
    $('#Clear').on('click', function () {
        $('#hedgehogForm')[0].reset();
        $('.error').text('');
        $('#ResultContainer').hide();
        $('#ResultDisplay').text('');
    });
});