from matplotlib import pyplot as plt
import matplotlib.patches as mpatches
import saic
import sys


fig, ax = plt.subplots()
plt.subplots_adjust(left=0.1, bottom=0.30)
s_line, = plt.plot([], [], lw=2, color='green', label='The red data')
a_line, = plt.plot([], [], lw=2, color='red')
i_line, = plt.plot([], [], lw=2, color='blue')
c_line, = plt.plot([], [], lw=2, color='black')

plt.axis([0, 800, 0, 20000])

s_patch = mpatches.Patch(color='green', label='S')
a_patch = mpatches.Patch(color='red', label='A')
i_patch = mpatches.Patch(color='blue', label='I')
c_patch = mpatches.Patch(color='black', label='C')
plt.legend(handles=[s_patch, a_patch, i_patch, c_patch], loc=1)


def update(val=0):
    a, b1, b2, g, w = (float(arg) for arg in sys.argv[1:])
    model = saic.Model(a, b1, b2, g, w)
    data = model.run()

    x_data = range(len(data[0]))
    s_line.set_data(x_data, data[0])
    a_line.set_data(x_data, data[1])
    i_line.set_data(x_data, data[2])
    c_line.set_data(x_data, data[3])

    fig.canvas.draw_idle()

update()
plt.show()
