from mpl_toolkits.mplot3d import axes3d
import matplotlib.pyplot as plt
import sir


fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')

model = sir.Model(0.03, 0.0008)
X, Y, Z = model.run()
ax.plot_wireframe(X, Y, Z)

plt.show()
