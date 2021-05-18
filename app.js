//Hello Word

const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// Importar rotas
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const brainTreeRouter = require("./routes/braintree");
const orderRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const customizeRouter = require("./routes/customize");

// Import Auth middleware for check user login or not~
const { loginCheck } = require("./middleware/auth");

// Banco de dados
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() =>
    console.log(
      "==============Banco de Dados Conectado=============="
    )
  )
  .catch((err) => console.log("Banco de Dados Invalido !!!"));

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rotas
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api", brainTreeRouter);
app.use("/api/order", orderRouter);
app.use("/api/customize", customizeRouter);

app.use((req, res, next) => { //Cria um middleware onde todas as requests passam por ele
  if ((req.headers["x-forwarded-proto"] || "").endsWith("http")) //Checa se o protocolo informado nos headers é HTTP
      res.redirect(`https://${req.hostname}${req.url}`); //Redireciona pra HTTPS
  else //Se a requisição já é HTTPS
      next(); //Não precisa redirecionar, passa para os próximos middlewares que servirão com o conteúdo desejado
});

//Mensagem para saber se esta funcionando
app.get("/", (req, res) => {
      res.send("<h1>DEFALT</h1>")
})



// Server
const PORT = process.env.PORT || 3000; //Mudar para Porta 3000 para Rodar na Umbler
app.listen(PORT, () => {
  console.log("Backend rodando na porta ", PORT);
});
