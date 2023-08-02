var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel')

/* GET home page. */
router.get('/', async function (req, res, next) {
  var novedades = await novedadesModel.getNovedades();
  novedades.sort((a, b) => a.id - b.id);
  res.render('admin/novedades', {
    layout: 'admin/layout',
    persona: req.session.nombre,
    novedades
  });
});
router.get('/agregar', (req, res, next) => {
  res.render('admin/agregar', {
    layout: 'admin/layout'
  })
});
router.post('/agregar', async (req, res, next) => {

  try {
    console.log(req.body)

    if (req.body.nombre != "" &&  req.body.testimonio != "") {
      await novedadesModel.insertNovedad(req.body);
      res.redirect('/admin/novedades')
    } else {
      res.render('admin/agregar', {
        layout: 'admin/layout',
        error: true,
        message: 'Todos los campos son requeridos'
      })
    }
  } catch (error) {
    console.log(error)
    res.render('admin/agregar', {
      layout: 'admin/layout',
      error: true,
      message: 'No se cargo la novedad'
    })
  }
});

router.get('/eliminar/:id', async (req, res, next) => {
  var id = req.params.id;
  await novedadesModel.deleteNovedadesById(id);
  res.redirect('/admin/novedades');
});

router.get('/modificar/:id', async (req, res, next) => {
  var id = req.params.id;
  var novedad = await novedadesModel.getNovedadById(id);

  res.render('admin/modificar', {
    layout: 'admin/layout',
    novedad
  });
});

router.post('/modificar', async (req, res, next) => {
  try {
    const novedadEnDB = await novedadesModel.getNovedadById(req.body.id)
    const body = req.body
    if (body.nombre !== novedadEnDB.nombre || body.testimonio !== novedadEnDB.testimonio) {
      var obj = {
        nombre: req.body.nombre,
        testimonio: req.body.testimonio
      }

      await novedadesModel.modificarNovedadById(obj, req.body.id);
      res.redirect('/admin/novedades');
    } else {
      res.render('admin/modificar', {
        layout: 'admin/layout',
        error: true, message: 'No se modificó la novedad'
      })
    }

  } catch (error) {
    res.render('admin/modificar', {
      layout: 'admin/layout',
      error: true, message: 'No se modificó la novedad'
    })
  }
})


module.exports = router;