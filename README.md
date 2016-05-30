# Sir Model (epidemiology experiments)
Modeling app link - [CLICK](https://rawgit.com/ichko/SirModel/master/src/model/index.html)

##Example
```python
alpha = 0.3
beta = 0.5

model_init = Model(alpha, beta)
exp_data = model_init.run()

result = model_approx(
    model_init = model_init,
    exp_data = exp_data,
    var_name = 'beta')

print(result) #0.5000000000000003 close enough
```
