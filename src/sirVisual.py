from matplotlib import pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.widgets import Slider
import numpy as np
import math
import sir


fig, ax = plt.subplots()
plt.subplots_adjust(left=0.1, bottom=0.30)
s_line, = plt.plot([], [], lw=2, color='green', label='The red data')
i_line, = plt.plot([], [], lw=2, color='red')
r_line, = plt.plot([], [], lw=2, color='blue')
plt.axis([0, 500, 0, 1000])

s_patch = mpatches.Patch(color='green', label='S')
i_patch = mpatches.Patch(color='red', label='I')
r_patch = mpatches.Patch(color='blue', label='R')
plt.legend(handles=[s_patch, i_patch, r_patch], loc=1)

axcolor = 'lightgoldenrodyellow'
axfreq = plt.axes([0.1, 0.15, 0.65, 0.03], axisbg=axcolor)
axamp = plt.axes([0.1, 0.20, 0.65, 0.03], axisbg=axcolor)
sInitAmp = plt.axes([0.1, 0.10, 0.65, 0.03], axisbg=axcolor)
iInitAmp = plt.axes([0.1, 0.05, 0.65, 0.03], axisbg=axcolor)

s_alpha = Slider(axfreq, 'alpha', 1, 100, valinit=30)
s_beta = Slider(axamp, 'beta', 1, 35, valinit=4)
s_sInit = Slider(sInitAmp, 'susceptible', 1, 1000, valinit=750)
s_iInit = Slider(iInitAmp, 'infected', 1, 100, valinit=2)

def update(val):
    alpha = s_alpha.val / 100000
    beta = s_beta.val / 500000
    model = sir.Model(alpha, beta, s_sInit.val, s_iInit.val, 0)
    model.time_unit = 10
    data = model.run()

    basic_reproduction = 2 #sir['Ro']
    if basic_reproduction > 0:
        print('epidemic')
    else:
        print('none epidemic')

    print(basic_reproduction)
    print('alpha: ' + str(alpha) + ' beta: ' + str(beta))

    s_line.set_data(range(len(data[0])), data[0])
    i_line.set_data(range(len(data[1])), data[1])
    r_line.set_data(range(len(data[2])), data[2])

    fig.canvas.draw_idle()

s_alpha.on_changed(update)
s_beta.on_changed(update)
s_sInit.on_changed(update)
s_iInit.on_changed(update)
update(0)

plt.show()
