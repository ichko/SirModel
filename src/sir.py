import math


class Model:

    def __init__(self, alpha=0.01, beta=0.01,
                 s_init=750, i_init=1, r_init=0):
        self.s_init = s_init
        self.i_init = i_init
        self.r_init = r_init
        self.alpha = alpha
        self.beta = beta
        self.prob_revert = 0.03
        self.max_iter = 1000
        self.time_unit = 1
        self.basic_reproduction = None

    def run(self):
        S = [self.s_init]
        I = [self.i_init]
        R = [self.r_init]
        time = 0

        total_num_people = self.s_init + self.i_init + self.r_init
        self.basic_reproduction = self.s_init * self.beta - self.alpha

        while time < self.max_iter and (S[time] > 1 or I[time] > 1):
            s_to_i = self.beta * S[time] * I[time] * self.time_unit
            i_to_r = self.alpha * I[time] * self.time_unit

            if S[time] - s_to_i < 0:
                s_to_i = S[time]
            if I[time] + s_to_i - i_to_r < 0:
                i_to_r = I[time] + s_to_i

            r_to_s = R[time] * self.prob_revert

            S.append(S[time] - s_to_i + r_to_s)
            I.append(I[time] + s_to_i - i_to_r)
            R.append(total_num_people - (S[time] + I[time]))
            time += 1

        return [S, I, R]


class Utils:

    eps = 0.001

    @classmethod
    def derive(cls, func):
        return lambda x: (func(x + cls.eps) - func(x)) / cls.eps

    @staticmethod
    def rss(actual, expected):
        return sum((act - exp) ** 2 for act, exp in zip(actual, expected))

    @classmethod
    def rss_sum(cls, model_data, exp_data):
        return sum(cls.rss(model_set, exp_set)
                   for model_set, exp_set in zip(model_data, exp_data))

    @classmethod
    def get_quality_metric(cls, model, exp_data, var_name):
        def quality_metric(var_val):
            setattr(model, var_name, var_val)
            return cls.rss_sum(model.run(), exp_data)

        return quality_metric


def model_approx(model_init, exp_data, var_name, var_init=0.1,
                 learning_rate=0.01, threshold=0.001, max_iter=1000):
    var_val = var_init
    quality_metric = Utils.get_quality_metric(model_init, exp_data, var_name)
    gradient = Utils.derive(quality_metric)
    current_error = quality_metric(var_val)

    while max_iter and current_error > threshold:
        var_val = var_val - math.copysign(learning_rate, gradient(var_val))
        current_error = quality_metric(var_val)
        max_iter -= 1

    return var_val
