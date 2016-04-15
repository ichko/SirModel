import unittest
import sir


def close(actual, expected, eps=0.000001):
    return abs(actual - expected) < eps


class SirTests(unittest.TestCase):
    def test_small_beta(self):
        expected_beta = 0.0005
        model_init = sir.Model(alpha=0.03, beta=expected_beta)
        experimantal = model_init.run()

        actual_under_beta = sir.model_approx(model_init, experimantal,
                                             var_name='beta',
                                             var_init=0,
                                             learning_rate=0.0005,
                                             max_iter=500,
                                             threshold=0)
        actual_over_beta = sir.model_approx(model_init, experimantal,
                                            var_name='beta',
                                            var_init=0.001,
                                            learning_rate=0.00001,
                                            max_iter=500)

        self.assertTrue(close(actual_under_beta, expected_beta, eps=0.0001))
        self.assertTrue(close(actual_over_beta, expected_beta, eps=0.0001))

    def test_susceptible_search(self):
        exp_susceptible = 750
        model_init = sir.Model(alpha=0.5, beta=0.3, s_init=exp_susceptible)
        experimantal = model_init.run()

        actual_under = sir.model_approx(model_init, experimantal,
                                        var_name='s_init',
                                        var_init=300,
                                        learning_rate=2,
                                        max_iter=300)
        actual_over = sir.model_approx(model_init, experimantal,
                                       var_name='s_init',
                                       var_init=1200,
                                       learning_rate=2,
                                       max_iter=300)

        self.assertTrue(close(actual_under, exp_susceptible))
        self.assertTrue(close(actual_over, exp_susceptible))

    def test_alpha_search(self):
        expected_alpha = 0.3
        model_init = sir.Model(alpha=expected_alpha, beta=0.5)
        experimantal = model_init.run()

        actual_under_alpha = sir.model_approx(model_init, experimantal,
                                              var_name='alpha',
                                              var_init=0.05,
                                              learning_rate=0.01,
                                              max_iter=100)
        actual_over_alpha = sir.model_approx(model_init, experimantal,
                                             var_name='alpha',
                                             var_init=1,
                                             learning_rate=0.01,
                                             max_iter=100)

        self.assertTrue(close(actual_under_alpha, expected_alpha))
        self.assertTrue(close(actual_over_alpha, expected_alpha))

    def test_beta_search(self):
        expected_beta = 0.5
        model_init = sir.Model(alpha=0.3, beta=expected_beta)
        experimantal = model_init.run()

        actual_under_beta = sir.model_approx(model_init, experimantal,
                                             var_name='beta',
                                             var_init=0.1,
                                             learning_rate=0.01,
                                             max_iter=100)
        actual_over_beta = sir.model_approx(model_init, experimantal,
                                            var_name='beta',
                                            var_init=1,
                                            learning_rate=0.01,
                                            max_iter=100)

        self.assertTrue(close(actual_under_beta, expected_beta))
        self.assertTrue(close(actual_over_beta, expected_beta))


if __name__ == '__main__':
    unittest.main()
