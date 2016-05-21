from math import log


class Model:

    def __init__(self, a=0.8, b1=0.001, b2=0.2, g=0.005, w=0.00001, dt=1/24,
                 s_init=7000, a_init=100, i_init=4000, c_init=10):
        self.s_init = s_init
        self.a_init = a_init
        self.i_init = i_init
        self.c_init = c_init
        self.alpha = a
        self.beta1 = b1
        self.beta2 = b2
        self.delta = g
        self.omega = w
        self.dt = dt
        self.max_iter = 800

    def run(self):
        scale = 5000
        S, A, I, C = ([s + scale] for s in (self.s_init, self.a_init,
                                            self.i_init, self.c_init))
        time = 0

        while time < self.max_iter:
            s, a, i, c = S[-1], log(A[-1]), I[-1], C[-1]

            ds = -self.alpha * s * log(i) / a - self.omega * s * a
            da = self.omega * s * a + self.beta1 * c * a + self.delta * i * a
            di = self.beta2 * c - self.delta * a * i
            dc = self.alpha * s * log(
                i) / a - self.beta1 * c * a - self.beta2 * c

            new_vals = (int(c + d * self.dt) if c + d > 0 else 0 for d, c
                        in zip((ds, da, di, dc), (s, A[-1], i, c)))

            S, A, I, C = (l + [val] for l, val in zip((S, A, I, C), new_vals))
            time += 1

        return tuple(list(day - 100 for day in g) for g in (S, A, I, C))


model = Model()
result = model.run()
print(result)
