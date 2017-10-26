library(tidyverse)

data <- read_delim("data.csv",
                   ";",
                   escape_double = FALSE,
                   col_types = cols(
                     correct_response = col_logical(),
                     target = col_factor(
                       levels = c("left",
                                  "right"
                        )
                     )
                   ),
                   trim_ws = TRUE
)

correctness <- function(n, target_side) {
  total <- data %>% filter(target == target_side) %>% nrow()
  round((n / total) * 100, 2)
}

correct_responses <- data %>% filter(correct_response == TRUE)

n_correct_responses <- nrow(correct_responses)
mean_rt <- mean(correct_responses$RT)
median_rt <- median(correct_responses$RT)
var_rt <- var(correct_responses$RT)
sd_rt <- sd(correct_responses$RT)
percent_correct_responses <- round(n_correct_responses / nrow(data) * 100, 2)

data_summary <- correct_responses %>%
group_by(target) %>%
summarise(n = n(),
          mean_RT = mean(RT),
          median_RT = median(RT),
          var = var(RT),
          sd = sd(RT)
) %>%
mutate(correctness = correctness(n, target)) %>%
add_row(target = "total",
        n = n_correct_responses,
        mean_RT = mean_rt,
        median_RT = median_rt,
        var = var_rt,
        sd = sd_rt,
        correctness = percent_correct_responses,
        .before = 1
)

target_right <- correct_responses %>% filter(target == "right")
target_left <- correct_responses %>% filter(target == "left")

t.test(target_right$RT, target_left$RT)
data_summary
