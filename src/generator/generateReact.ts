import * as fs from "fs"

export default function ({ name, entities, relations }) {
    fs.mkdir(`./${name}Project/${name}ReactApp`, () => {
        fs.mkdir(`./${name}Project/${name}ReactApp/src`, () => {
            fs.appendFile(`./${name}Project/${name}ReactApp/src/App.css`,
                `.App {
        text-align: center;
    }
    
    .App-logo {
        pointer-events: none;
    }
    
    @media (prefers-reduced-motion: no-preference) {
        .App-logo {
            animation: App-logo-spin infinite 20s linear;
        }
    }
    
    .App-header {
        background-color: #282c34;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: calc(10px + 2vmin);
        color: white;
    }
    
    .App-link {
        color: #61dafb;
    }
    
    @keyframes App-logo-spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
    
    button {
        font-size: calc(10px + 2vmin);
    }
    
    `
                , () => { })

            fs.mkdir(`./${name}Project/${name}ReactApp/src/hooks`, () => {
                fs.appendFile(`./${name}Project/${name}ReactApp/src/hooks/hooks.js`,
                    `import * as React from "react";
                import axiosInstance from "../store/axiosInstance"
                import { useParams } from "react-router-dom";
                import { StateContext } from "../store/store"
                
                export async function useTryCatch(promise) {
                    try {
                        return [await promise, null]
                    } catch (e) {
                        return [null, e]
                    }
                }
                
                
                export function useList({ name, effects, take, skip }) {
                    const appContext = React.useContext(StateContext)
                    const dispatch = appContext["dispatch"]
                    const dir = appContext[\`\${name}List\`] || []
                    async function update() {
                        dispatch({ type: "ADD_ENTITIES", context: \`\${name}ListLoader\`, payload: true })
                        const getListPromise = axiosInstance.get(\`/\${name}?take=\${take}&skip=\${skip}\`)
                        const [res, e] = await useTryCatch(getListPromise)
                        if (e) {
                            dispatch({ type: "ADD_ENTITIES", context: \`\${name}ListLoader\`, payload: false })
                            dispatch({ type: "ERROR", where: \`\${name}List\`, error: e })
                        } else {
                            const { data } = res;
                            dispatch({
                                type: "ADD_ENTITIES",
                                context: \`\${name}List\`,
                                payload: data.concat((Boolean(take) && Boolean(skip)) ? dir : [])
                            })
                            dispatch({ type: "ADD_ENTITIES", context: \`\${name}ListLoader\`, payload: false })
                        }
                    }
                
                    React.useEffect(() => {
                        update()
                    }, [])
                
                
                    React.useEffect(() => {
                        update()
                    }, effects || [])
                }
                
                
                export function useItem({ name, key, effects, id }) {
                
                
                    const appContext = React.useContext(StateContext)
                    const loading = appContext[\`\${name}ListLoader\`]
                    const all = (appContext[\`\${name}List\`] || [])
                    const updated = all.filter(f => f.isEdited).length
                    const [state, setState] = React.useState(null)
                
                    const params = useParams()
                
                    function update() {
                        const list = (appContext[\`\${name}List\`] || []);
                        const index = list.map(l => l[key]).indexOf(id || params[key]);
                        setState(list[index]);
                    }
                
                    React.useEffect(() => {
                        update()
                    }, [])
                
                    React.useEffect(() => {
                        update()
                    }, [name, params[key], loading, id, all, updated].concat(effects))
                
                    return {... {}, [name]: state, loading }
                }
                
                export function useQueries() {
                    return ({ redirect: "" })
                }
                
                export function useDispatch() {
                    const { dispatch } = React.useContext(StateContext)
                    return dispatch;
                }`
                    , () => { })
            })

            fs.mkdir(`./${name}Project/${name}ReactApp/src/data`, (
            ) => {
                fs.appendFile(`./${name}Project/${name}ReactApp/src/data/data.js`, `
        
      const relations = [${relations.map((r: any, i) => `{left:"${r.left}", right:"${r.right}", type:"${r.type}"}`)}]
      const entities = [${entities.map((e: any) => `{EntityName:"${e.EntityName}", nameKey: "${e.columns[0].key}" ,columns:[${e.columns.map((c: any) => `{key:"${c.key}", nullable:${c.nullable}, type:"${c.type}"}`)}]}`)}]
      
      export function getEntities() {
          return entities
      }
      
      export function getEntity(name) {
          return entities.reduce((p, c) => ({...p, [c.EntityName]: c }), {})[name]
      }
      
      export function getRelations(name) {
          return (relations || []).filter(f => (name === f.left) || (name === f.right)) || []
      }
      
      export function filterUnique(v, i, s) {
          return s.indexOf(v) === i
      }
      
      export function getRelation(rel, name) {
          if (rel.left === name) {
              return rel.right
          } else {
              return rel.left
          }
      }

      export function inverseRelations(rel, name) {
        if (rel.type === "OneToOne" || rel.type === "ManyToMany") {
            return rel.type
        }
        if (rel.left === name && rel.type === "OneToMany") {
            return "ManyToOne"
        } else {
            return "OneToMany"
        }
    }
      
      
      `, () => { })
            })


            fs.mkdir(`./${name}Project/${name}ReactApp/src/components`, (
            ) => {
                fs.appendFile(`./${name}Project/${name}ReactApp/src/components/Nav.jsx`,
                    `import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import logo from "../logo.svg"
import Button from "@mui/material/Button"
import { useHistory } from "react-router-dom";

export default function Nav() {
    const { push } = useHistory()
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar elevation={0} color="default" position="fixed">
                <Toolbar>
                    <img onClick={()=>push("/")}  className="App-logo" style={{ borderRadius: "4px" }} height={66} src={logo} alt="Protus Logo" />
                    <Box sx={{ flexGrow: 1 }} />
                    <Button disabled  sx={{ ml: 3 }} >Login</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
`
                    , () => { })
                fs.appendFile(`./${name}Project/${name}ReactApp/src/components/Entity.jsx`,
                    `import * as React from "react";
                import Grid from "@mui/material/Grid"
                import {List} from "../widgets/List"
                import {Form} from "../widgets/Form"
                import Box from "@mui/material/Box"
                import Toolbar from "@mui/material/Toolbar"
                
                import { Switch, Route, useRouteMatch } from "react-router-dom"
                import { Detail } from "../widgets/Detail";
                
                export function Entity({ name }) {
                    const { path } = useRouteMatch()
                    return (
                        <Box sx={styles["container"]} >
                        <Toolbar />
                            <Grid container spacing={2} >
                                <Grid item xs={5} >
                                    <List name={name} />,
                                </Grid>
                                <Grid item xs >
                                    <Switch>
                                        {["", ":id"].map((r, i) => {
                                            const components = {
                                                "": <Form name={name} />,
                                                ":id": <Detail edit name={name} />
                                            }
                                            return (
                                                <Route key={i} exact path={\`\${path}\${r ? \`/\${r}\` : ""}\`}  >
                                                    {components[r]}
                                                </Route>
                                            )
                                        })}
                                    </Switch>
                                </Grid>
                            </Grid>
                        </Box>
                    )
                }
                
                
                const styles = {
                    container: {
                        p: 2,
                    },
                }
                `
                    , () => { })
                fs.appendFile(`./${name}Project/${name}ReactApp/src/components/Home.jsx`,
                    `import logo from "../logo.svg"
                import Container from "@mui/material/Container"
                import Box from "@mui/material/Box"
                import { getEntities } from "../data/data"
                import Link from "@mui/material/Link"
                import Typography from "@mui/material/Typography"
                import { useHistory } from "react-router-dom"
                import Toolbar from "@mui/material/Toolbar"
                import Divider from "@mui/material/Divider"
                export function Home() {
                    const { push } = useHistory()
                    return (
                        <Container>
                            <Toolbar />
                            <Box sx={styles["header"]} >
                                <Box>
                                    <img className={"App-logo"} height="108" src={logo} alt="logo" />
                                    <br />
                                    <Typography variant="h6" >Hello, world!</Typography>
                                    <Typography sx={{ mt: 2 }} variant="h3" >App Project</Typography>
                                    <Divider sx={{ mt: 2 }} />
                                    <Typography variant="h5" sx={{ mt: 5 }} >Models</Typography>
                                </Box>
                            </Box>
                            <Box sx={styles["body"]} >
                                {getEntities().map(e => e.EntityName).map((e, i) => {
                                    return (
                                        <Box key={i} >
                                            <Link onClick={() => push(\`/\${e}\`)} sx={styles["link"]} >{e}</Link>
                                    </Box>
                                    )
                                })}
                            </Box>
                
                            <Box sx={{ textAlign: "center", mt: 4 }} >
                                <Typography sx={{ mb: 1 }} >Edit models in /src/data/data.js</Typography>
                                    {/* <Box>
                                        <Link  >Customize this app</Link>
                                        <span sx=
                                            {{ fontWeight: "bold" }} > . </span>
                                        <Link  >Working with the server</Link>
                                    </Box> */}
                            </Box>
                
                        </Container>
                    )
                
                }
                
                const styles = {
                    header: {
                        minHeight: "30vh",
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        mt: 6
                    },
                    body: {
                        mt: 3,
                        justifyContent: "center",
                        display: "flex"
                
                    },
                    link: {
                        mx: 3
                    },
                    alert: {
                        mt: 3
                    }
                }`
                    , () => { })

                fs.appendFile(`./${name}Project/${name}ReactApp/src/components/Auth.jsx`,
                    `import * as React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import CircularProgress from "@mui/material/CircularProgress"
import TextField from "@mui/material/TextField"

import axiosInstacce from "../store/axiosInstance";
import { useTryCatch } from "../hooks/hooks";

const Switch = ({ children }) => <>{children}</>
const Route = ({ children }) => <>{children}</>


export function Auth() {
    const path = ""
    return (
        <Switch>
            {["Login", "Signup"].map((r, i) => (
                <Route key={i} path={\`\${path}/\${r}\`}  >
                    <Login enRoute={r} />
                </Route>
            ))}
        </Switch>
    )
}


function Login({ enRoute }) {

    const [loading, setLoading] = React.useState(false)
    const [state, setState] = React.useState(false)
    const [error, setError] = React.useState(false)

    const dispatch = () => { }
    // const {next} = useQueries()
    // const push = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        const promise = axiosInstance.post(\`/\${enRoute.toLowerCase()}\`, state)
        const [{ data } , err] = await useTryCatch(promise);
        if (err) {
            setError(err)
            setLoading(false)
            return;
        }
        dispatch({ type: "ADD_ENTITIES", payload: data, context: "user" });
        dispatch({ type: "ADD_ENTITIES", payload: true, context: "isLoggedIn" });
        setLoading(false);
        // push(next)
    }

    function handleChange(e) {
        setState({ ...state, [e.target.name]: e.target.value })
    }

    return (
        <form onSubmit={handleSubmit}>
            <Paper sx={styles["container"]} >
                <Stack spacing={2} >
                    <Box sx={styles["header"]} >
                        <Typography variant="h5" >{enRoute}</Typography>
                        <Typography variant="body" >ProjectName</Typography>
                    </Box>
                    <TextField required label="Username" onChange={handleChange} fullWidth />
                    <TextField helperText={enRoute === "Signup" ? passValText : null} type="password" required label="Password" onChange={handleChange} fullWidth />
                    <Button
                        color={loading ? "secondary" : "primary"}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                        disableElevation
                        type={loading ? "button" : "submit"}
                        fullWidth variant="contained"
                    >{loading ? null : "Submit"}</Button>
                </Stack>
            </Paper>
        </form>

    )
}


const passValText = "Use atleast 8 alphanumeric digits and and a special character"


const styles = {
    container: {
        p: 2,
        mt: 5,
        mb: 9
    },
    header: {
        bgcolor: "lightgray",
        mt: 5,
        textAlign: "center",
        borderRadius: "4px",
        minHeight: 80,
        textAlign: "center",
        pt: 5
    }
}`
                    , () => { })
            })


            fs.mkdir(`./${name}Project/${name}ReactApp/src/widgets`, (
            ) => {
                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/Dialog.jsx`,

                    `
import React from "react"
import { Form } from "./Form"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import { useParams } from "react-router-dom"
import Button from "@mui/material/Button"
import Link from "@mui/material/Link"

export function AddDialog({ name, title }) {
    const [open, setOpen] = React.useState(false)
    const { id } = useParams()
    return (
        <>
            <Button onClick={() => setOpen(!open)} >Add</Button>
            <Dialog onClose={() => setOpen(!open)} fullWidth open={open} >
                <DialogContent dividers >
                    <Form dialog next={() => setOpen(false)} name={name} relationship={title} rID={id} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} >Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export function EditDialog({ name, title, link, id }) {
    const [open, setOpen] = React.useState(false)
    const toggle = (e) => {
        e.stopPropagation()
        setOpen(!open)
    }
    return (
        <>
            {!link && (
                <Button onClick={toggle} >Edit</Button>
            )
            }
            {link && (
                <Link onClick={toggle} >Edit</Link>
            )
            }
            <Dialog onClose={toggle} fullWidth open={open} >
                <DialogContent dividers >
                    <Form edit next={() => setOpen(!open)} name={name} rID={id} relationship={title} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(!open)} >Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}`
                    , () => {

                    })
                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/Form.jsx`,
                    `import * as React from "react";
                import Box from "@mui/material/Box"
                import Typography from "@mui/material/Typography"
                import Button from "@mui/material/Button"
                import Stack from "@mui/material/Stack"
                import CircularProgress from "@mui/material/CircularProgress"
                import TextField from "@mui/material/TextField"
                import FormControlLabel from "@mui/material/FormControlLabel"
                import MSwitch from "@mui/material/Switch"
                import Alert from "@mui/material/Alert"
                import Link from "@mui/material/Link"
                import { useTryCatch, useQueries, useDispatch, useItem } from "../hooks/hooks";
                import axiosInstance from "../store/axiosInstance";
                import { getEntity, getRelations, filterUnique, getRelation, inverseRelations } from "../data/data";
                
                import { useHistory } from "react-router-dom"
                import { SelectMultiple, SelectSingle } from "./Select";
                import { Loader } from "./Loader";
                
                export function Form({ name, relationship, dialog, rID, next, edit }) {
                
                
                    const { redirect } = useQueries()
                    const entity = getEntity(relationship || name)
                    const relations = getRelations(name)
                
                
                    const [loading, setLoading] = React.useState(false)
                    const [error, setError] = React.useState(false)
                    const [success, setSuccess] = React.useState(false)
                
                    const item = useItem({
                        name,
                        id: rID,
                        key: "id"
                    })
                
                
                    const [state, setState] = React.useState({ id: rID })
                
                    const loader = item["loading"]
                
                    const { push } = useHistory()
                    const dispatch = useDispatch()
                
                    async function handleSubmit(e) {
                        e.preventDefault()
                        setLoading(true)
                        setError(false)
                        setSuccess(false)
                        const promise = axiosInstance[edit ? "put" : "post"](\`/\${relationship || name}\`, { ...state, [relationship]: rID })
                        const [res, err] = await useTryCatch(promise);
                        if (err) {
                            setError(err)
                            setLoading(false)
                            return;
                        }
                        setSuccess(true)
                        if (edit) {
                            dispatch({
                                type: "UPDATE_ENTITY",
                                payload: { ...res.data, isEdited: true },
                                context: \`\${relationship || name}List\`,
                                id: rID
                            });
                        } else {
                            dispatch({
                                type: "ADD_ENTITY",
                                payload: { ...res.data, isNew: true },
                                context: \`\${relationship || name}List\`
                            });
                        }
                        setLoading(false);
                        if (redirect || next) {
                            setState(null)
                            setTimeout(() => {
                                if (next) {
                                    next()
                                } else {
                                    push(redirect)
                                }
                            }, 450)
                        } else {
                            setState(null)
                        }
                
                    }
                
                    function handleChange(e) {
                        setError(false);
                        setSuccess(false);
                        setState(p => ({ ...p, [e.target.name]: e.target.value }))
                    }
                
                    function hadleRelChange(v, name) {
                        setState({ ...state, [name]: v })
                    }
                
                
                    const data = item[name]
                
                
                
                    return (
                        <form onSubmit={handleSubmit}>
                            <Stack sx={styles["container"]} spacing={2} >
                                {!edit && !dialog && (
                                    <Box sx={{ textAlign: "right" }}>
                                        <Link onClick={() => push("/")} >Back Home</Link>
                                    </Box>
                                )}
                                <Box sx={styles["header"]} >
                                    <Typography variant="h5" >{edit ? "Edit" : "New"} {relationship || name}</Typography>
                                </Box>
                                {edit && loader && (
                                    <Loader />
                                )}
                                <Stack spacing={2} >
                                    {entity?.columns?.map((e, i) => {
                                        const fields = {
                                            password: <TextField
                                                name={e.key}
                                                key={i}
                                                type={e.key.toLowerCase() === "password" ? "password" : e.type}
                                                required
                                                label={e.key}
                                                onChange={handleChange}
                                                fullWidth />,
                                            string: <TextField
                                                placeholder={(edit && state) ? state[e.key] : ""}
                                                name={e.key}
                                                key={i}
                                                helperText={edit && data ? \`Current value: \${data[e.key]}\` : null}
                                                type={e.type.toLowerCase() === "password" ? "password" : e.type}
                                                required
                                                label={e.key}
                                                onChange={handleChange}
                                                fullWidth />,
                                            boolean: <FormControlLabel
                                                key={i}
                                                name={e.key}
                                                control={<MSwitch defaultChecked />}
                                                label={e.key}
                                            />
                                        }
                                        return fields[e.type]
                                    })}
                                    {!dialog && (
                                        <>  {relations.filter(filterUnique).map((m, i) => {
                                            const relations = {
                                                OneToMany: <SelectMultiple key={i} name={name} title={getRelation(m, name)} handleChange={hadleRelChange} value={null} />,
                                                ManyToMany: <SelectMultiple key={i} name={name} title={getRelation(m, name)} handleChange={hadleRelChange} value={null} />,
                                                ManyToOne: <SelectSingle key={i} name={name} title={getRelation(m, name)} handleChange={hadleRelChange} value={null} />,
                                                OneToOne: <SelectSingle
                                                    key={i}
                                                    name={name}
                                                    title={getRelation(m, name)}
                                                    handleChange={hadleRelChange}
                                                    value={state ? state[getRelation(m, name).toLowerCase()] : null} />
                                            }
                                            return relations[inverseRelations(m, name)]
                                        })}
                                        </>
                                    )}
                                </Stack>
                
                                <Box>
                                    {success && (
                                        <Alert>Success</Alert>
                                    )}
                                    {error && (
                                        <Alert severity="error" >An error occured</Alert>
                                    )}
                                </Box>
                                <Button
                                    color={loading ? "secondary" : "primary"}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
                                    disableElevation
                                    onClick={(relationship || edit) ? (e) => handleSubmit(e) : () => { }}
                                    type={(loading || relationship || edit) ? "button" : "submit"}
                                    fullWidth variant="contained"
                                >{loading ? null : "Save"}</Button>
                            </Stack>
                        </form>
                    )
                }
                
                
                
                
                const styles = {
                    container: {
                        p: 2,
                    },
                    header: {
                        bgcolor: "lightgray",
                        py: 3,
                        textAlign: "center",
                        borderRadius: "4px",
                        minHeight: 30,
                    },
                    emptyDesc: {
                        minHeight: "30vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        container: {
                            maxHeight: "72vh",
                            overflow: "auto"
                        }
                    }
                }
                `
                    , () => {

                    })

                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/Select.jsx`,
                    `import * as React from "react";
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import Autocomplete from "@mui/material/Autocomplete"
import { useList } from "../hooks/hooks";
import { StateContext } from "../store/store";
import { getEntity } from "../data/data";
import Checkbox from "@mui/material/Checkbox"
import { AddDialog } from "./Dialogs";
import Box from "@mui/material/Box"

export function SelectMultiple({ title, handleChange, value, name }) {
    useList({ name: title, effects: [title], take: 0, skip: 0 })
    const appContext = React.useContext(StateContext);
    const key = getEntity(title).nameKey
    const data = (appContext[\`\${title}List\`] || [])

    return (
        <Grid container spacing={1} >
            <Grid item xs >
                <Autocomplete
                    size="small"
                    disablePortal
                    required
                    value={value}
                    options={data}
                    getOptionLabel={(o) => o[key]}
                    onChange={(e, v) => handleChange(v, title)}
                    renderInput={(params) => (
                        <TextField
                            fullWidth
                            size="small"
                            {...params}
                            label={title}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={2} >
                <AddDialog title={title} />
            </Grid>
        </Grid>
    )
}



export function SelectSingle({ title, handleChange, value, name }) {
    const appContext = React.useContext(StateContext);
    const data = appContext[\`\${title}List\`] || []
    const key = getEntity(title).nameKey
    const other = appContext[\`\${name}List\`] || []
    useList({ name: title, effects: [title], take: 0, skip: 0 })
    return (
        <Grid container spacing={1} >
            <Grid item xs >
                <Autocomplete
                    size="small"
                    disablePortal
                    required
                    value={value}
                    options={data}
                    getOptionLabel={(o) => o[key]}
                    onChange={(e, v) => handleChange(v, title)}
                    renderOption={(props, option, { selected }) => (
                        <Box component="li" {...props}>
                            <Checkbox
                                size="small"
                                sx={{ mr: 2, flexShrink: 0 }}
                                checked={selected}
                            />
                            <span style={{ display: "flex", justifyContent: "space-between" }}>
                                {option[key]}
                            </span>
                        </Box>
                    )}
                    renderInput={(params) => (
                        <TextField
                            fullWidth
                            size="small"
                            {...params}
                            label={title}
                        />
                    )}
                />
            </Grid>
            <Grid item xs={2} >
                <AddDialog title={title} />
            </Grid>
        </Grid>

    );
}

`
                    , () => { })
                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/Loader.jsx`,
                    `import CircularProgress from "@mui/material/CircularProgress"
                    import Box from "@mui/material/Box"
                    
                    export function Loader() {
                        return (
                            <Box sx={{ minHeight: 40 }} >
                                <CircularProgress />
                            </Box>
                        )
                    }`
                    , () => { })


                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/Detail.jsx`,
                    `import * as React from "react";
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Stack from "@mui/material/Stack"
import Divider from "@mui/material/Divider"
import LinearProgress from "@mui/material/LinearProgress"
import { useItem, } from "../hooks/hooks";
import { getEntity, getRelation, filterUnique, getRelations } from "../data/data";
import Link from "@mui/material/Link"
import { useHistory } from "react-router-dom";

export function Detail({ name, relationship, }) {

    const data = useItem({
        name,
        key: "id",
    })

    const entity = getEntity(name)
    const relations = getRelations(name)



    const entityData = data[name]
    const { loading } = data;


    const { push } = useHistory()
    return (
        <>
            <Stack sx={styles["container"]} spacing={2} >
                <Box sx={{ textAlign: "right" }} >
                    <Link sx={{ mr: 2 }} onClick={() => push(\`/\`)} >Back Home</Link>
                    <Link onClick={() => push(\`/\${name}\`)} >Add new {name}</Link>
                </Box>
                <Box sx={styles["header"]} >
                    <Typography variant="h5" >{relationship || name} Detail</Typography>
                    {loading && (
                        <LinearProgress />
                    )}
                </Box>
                {Boolean(entityData) && !Boolean(loading) && (
                    <>
                        {entity?.columns?.map((e, i) => {
                            return <Box sx={{ mb: 2 }} key={i} >
                                <Typography> <span style={{ fontWeight: "bold" }} >{e?.key}</span>  : {entityData[e.key]}</Typography>
                            </Box>
                        })}
                    </>
                )}
                {!Boolean(entityData) && !Boolean(loading) && (
                    <>
                        {entity?.columns?.map((e, i) => {
                            return <Stack spacing={3} sx={{ mb: 2, textAlign: "center", py: 3 }} key={i} >
                                <Typography> Couldn't find item. It may have been deleted or you don't have a connection to the server</Typography>
                                <Link onClick={() => push("/")} >Go back home </Link>
                            </Stack>
                        })}
                    </>
                )}
                <Divider />
                <>  {relations.filter(filterUnique).map((m, i) => {
                    return <div key={i} >
                        <Box sx={{ mb: 2 }} key={i} >
                            <Typography> <span style={{ fontWeight: "bold" }} >{getRelation(m, name)}</span></Typography>
                        </Box>
                    </div>
                })}</>
            </Stack>
        </>
    )
}

const styles = {
    container: {
        p: 2,
    },
    header: {
        bgcolor: "lightgray",
        py: 1,
        textAlign: "center",
        borderRadius: "4px",
        minHeight: 30,
    },
    emptyDesc: {
        minHeight: "30vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        container: {
            maxHeight: "72vh",
            overflow: "auto"
        }
    }
}
`
                    , () => { })

                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/Delete.jsx`,
                    `import React from "react";
                    import Typography from "@mui/material/Typography";
                    import Box from "@mui/material/Box";
                    import Popover from "@mui/material/Popover";
                    import Alert from "@mui/material/Alert";
                    import Link from "@mui/material/Link";
                    import Button from "@mui/material/Button";
                    
                    import axiosInstance from "../store/axiosInstance";
                    import { useDispatch, useItem } from "../hooks/hooks";
                    
                    
                    export function Delete({ entity, eID, title }) {
                        const [anchorEl, setAnchorEl] = React.useState(null);
                        const dispatch = useDispatch()
                    
                    
                        const handleClick = (event) => {
                            event.stopPropagation()
                            setAnchorEl(event.currentTarget);
                        };
                    
                        const handleClose = (event) => {
                            event.stopPropagation()
                            setAnchorEl(null);
                        };
                    
                        const open = Boolean(anchorEl);
                        const id = open ? "simple-popover" : undefined;
                    
                        const [loading, setLoading] = React.useState(false);
                        const [error, setError] = React.useState(false)
                        const [success, setSuccess] = React.useState(false)
                    
                    
                        const handleDelete = (event) => {
                            event.stopPropagation()
                            setLoading(true);
                            setError(false)
                            setSuccess(false)
                            axiosInstance
                                .delete(\`/\${entity}/\${eID}\`)
                                .then(({ data }) => {
                                    setSuccess(true);
                                    setLoading(false)
                                    setTimeout(() => {
                                        dispatch({
                                            type: "REMOVE_ENTITY",
                                            payload: eID,
                                            context: \`\${entity}List\`
                                        })
                                    }, 450)
                                })
                                .catch((e) => {
                                    console.log(e);
                                    setError(true);
                                    setLoading(false)
                                });
                        };
                    
                    
                        return (
                            <>
                                <Link sx={{ cursor: "pointer" }} onClick={handleClick} >Remove</Link>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                >
                                    <Box sx={{ p: 2 }}>
                                        <Typography variant="h6" sx={{ mb: 1 }}  >
                                            Delete {entity} {title}?
                                        </Typography>
                    
                                        {error && (
                                            <Alert severity="error" >
                                                An error occured. Refresh this page and try again
                                            </Alert>
                                        )}
                                        {success && (
                                            <Alert severity="success" >
                                                Item has been deleted
                                            </Alert>
                                        )}
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }} >
                                            <Button onClick={handleClose} >Cancel</Button>
                                            <Button onClick={loading ? () => { } : handleDelete} variant="contained" disableElevation color="error"  >{loading ? "Deleting..." : "Delete"}</Button>
                                        </Box>
                                    </Box>
                                </Popover>
                            </>
                        );
                    }
                    `, () => { })

                fs.appendFile(`./${name}Project/${name}ReactApp/src/widgets/List.jsx`,
                    `import * as React from "react";
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import CircularProgress from "@mui/material/CircularProgress"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip"
import { useList } from "../hooks/hooks";
import { getEntity } from "../data/data";
import { StateContext } from "../store/store"
import { Delete } from "./Delete";
import { useHistory } from "react-router-dom";
import Typography from "@mui/material/Typography";
import { EditDialog } from "./Dialogs";

export function List({ name }) {
    const appContext = React.useContext(StateContext)

    const data = appContext[\`\${name}List\`]
    const loading = appContext[\`\${name}ListLoader\`]

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    useList({
        name, effects: [name, page, rowsPerPage], take: rowsPerPage, skip: (data || []).length
    })

    const entity = getEntity(name)


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    function createData(name, id, isNew, isEdited) {
        return { name, id, isNew, isEdited };
    }


    const rows = (data || []).map((c) =>
        createData(
            c[entity.columns[0]?.key],
            c.id,
            c.isNew,
            c.isEdited
        )
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const { push } = useHistory()
    return (
        <div style={styles["container"]} >
            <Box sx={{ my: 2 }} >{entity?.EntityName}(s)</Box>

            <TableContainer sx={{ maxHeight: "60vh", overflow: "auto" }} component={Paper}>
                <Table aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }} align="left">{entity?.nameKey}</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="left"></TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="left"></TableCell>
                            {Boolean(rows?.filter(f => f?.isNew)?.length) && (
                                <TableCell sx={{ fontWeight: "bold" }} align="left"></TableCell>
                            )}
                            {Boolean(rows?.filter(f => f?.isEdited)?.length) && (
                                <TableCell sx={{ fontWeight: "bold" }} align="left"></TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => (
                                <TableRow
                                    selected={window.location.pathname.includes(row.id)}
                                    onClick={() => push(\`/\${name}/\${row.id}\`)}
                                    key={i}
                                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                                >
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>
                                        <EditDialog id={row.id} name={name} link />
                                    </TableCell>
                                    <TableCell>
                                        <Delete entity={name} title={row.name} eID={row.id} />
                                    </TableCell>
                                    {Boolean(rows?.filter(f => f?.isNew)?.length) && (
                                        <TableCell>
                                            {row.isNew && (
                                                <Chip label="New" size="small" color="success" ></Chip>
                                            )}
                                        </TableCell>
                                    )}

                                    {Boolean(rows?.filter(f => f?.isEdited)?.length) && (
                                        <TableCell>
                                            {row.isEdited && (
                                                <Chip label="Updated" size="small" color="info" ></Chip>
                                            )}
                                        </TableCell>
                                    )}

                                </TableRow>
                            ))}
                        {!Boolean(rows.length) && loading && (
                            <TableRow
                                style={{
                                    height: 33 * 5,
                                }}
                            >
                                <TableCell colSpan={4}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <Box>
                                            <CircularProgress />
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {!Boolean(rows.length) && !loading && (
                            <TableRow
                                style={{
                                    height: 33 * 5,
                                }}
                            >
                                <TableCell colSpan={4}>
                                    <Box
                                        sx={{
                                            textAlign: "center",
                                        }}
                                    >
                                        <Box>
                                            <Typography>There are 0 {name}(s)</Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}

                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: 33 * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 20, 30, 40]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    )
}


const styles = {
    container: {
        p: 2,
        mt: 5,
        mb: 9
    },
    header: {
        bgcolor: "lightgray",
        mt: 5,
        borderRadius: "4px",
        minHeight: 80,
        textAlign: "center",
        pt: 5
    },
    emptyDesc: {
        minHeight: "30vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
    }
}
`
                    , () => {

                    })
            })

            fs.mkdir(`./${name}Project/${name}ReactApp/src/navigation`, () => {
                fs.appendFile(`./${name}Project/${name}ReactApp/src/navigation/Navigation.jsx`,
                    `
                import Nav from "../components/Nav"
                import { getEntities } from '../data/data'
                import Box from "@mui/material/Box"
                import { Entity } from '../components/Entity'
                import { Home } from "../components/Home"
                
                import Typography from "@mui/material/Typography"
                import Button from "@mui/material/Button"
                import {BrowserRouter as Router, Route, Switch} from "react-router-dom"
                const routes = [
                  { path: "/", component: <Home />, isExact: true },
                
                ]
                
                const entityRoutes = getEntities()
                  .map(e => ({
                    path: \`/\${e.EntityName}\`,
                    component: <Entity name={e.EntityName} />,
                  }))
                const combinedRoutes = (routes || []).concat(entityRoutes)
                
                export default function Navigation() {
                  return (
                    <Router>
                      <Nav />
                      <Switch>
                        {combinedRoutes.map(({ isExact, path, component }, i) => (
                          <Route key={i} exact={Boolean(isExact)} path={path}>
                            {component}
                          </Route>
                        ))}
                        <Route path="**" component={FO4} />
                      </Switch>
                    </Router>
                  );
                }
                
                const FO4 = () => {
                  const { push } = useHistory();
                  return (
                    <Box
                      sx={{
                        height: "100vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography variant="h6">Resource not found</Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography>Coming soon...</Typography>
                        <Button onClick={() => push("/")} variant="contained">
                          Back Home
                        </Button>
                      </Box>
                    </Box>
                  );
                };
                
                `
                    , () => { })

            })


            fs.mkdir(`./${name}Project/${name}ReactApp/src/store`, () => {
                fs.appendFile(`./${name}Project/${name}ReactApp/src/store/axiosInstance.js`, `
        import axios from "axios";
        const endpoint = "http://localhost:7072";
        
        
        const axiosInstance = axios.create({
            baseURL: endpoint
        });
        
        axiosInstance.interceptors.request.use(
            (config) => {
                const userToken = localStorage.getItem("access_token");
                if (userToken) {
                    config.headers.common["access_token"] = (userToken);
                }
                return config;
            },
            (error) => {
                console.log(error);
            });
        
        export { endpoint };
        export default axiosInstance;
                `, () => { })

                fs.appendFile(`./${name}Project/${name}ReactApp/src/store/store.js`,
                    `import { createContext } from "react";

export const initialState = {};

export const StateContext = createContext(initialState);

export const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_ENTITIES":
            return {
                ...state,
                [action.context]: action.payload,
            };
        case "ADD_ENTITY":
            const uiio = state[action.context] || [];
            uiio.unshift(action.payload);
            return {
                ...state,
                [action.context]: uiio,
            };
        case "CLEAR_ENTITIES":
            return {
                ...state,
                [action.context]: null,
            };
        case "REMOVE_ENTITY":
            const repo = state[action.context] || [];
            const item = repo.filter(r => r.id === action.payload)[0]
            const idx = repo.indexOf(item);
            if (idx > -1) {
                repo.splice(idx, 1);
            }
            return {
                ...state,
                [action.context]: repo,
            };

        case "UPDATE_ENTITY":
            let existing = state[action.context] || [];
            const toUpdate = existing.filter(r => r.id === action.id)[0]
            const index = existing.indexOf(toUpdate);
            if (index > -1) {
                existing[index] = action.payload
            }
            return {
                ...state,
                [action.payload]: existing,
            };

        case "RESET":
            return {}

        default:
            return {
                ...state,
            };
    }
};`
                    , () => { })
            })



            fs.appendFile(`./${name}Project/${name}ReactApp/src/index.css`,

                `
              body {
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                    sans-serif;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                }
                
                code {
                  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
                    monospace;
                }`
                , () => { })

            fs.appendFile(`./${name}Project/${name}ReactApp/src/App.jsx`,
                `
  import './App.css'
  import { useReducer } from "react";
  import { reducer, initialState, StateContext } from "./store/store";
  import Container from "@mui/material/Container"
  import Navigation from "./navigation/Navigation";
  
  export default function App() {
      const [state, dispatch] = useReducer(reducer, initialState);
    return (
        <Container>
        <StateContext.Provider value={{ ...state, dispatch }}>
          <Navigation />
        </StateContext.Provider>
        </Container>
      
    )
  }
              `
                , () => { })

            fs.appendFile(`./${name}Project/${name}ReactApp/src/main.jsx`,
                `
import React from "react"
import ReactDOM from "react-dom"
import './index.css'
import App from './App'
  
ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  )`
                , () => { })

            fs.appendFile(`./${name}Project/${name}ReactApp/src/logo.svg`,
                `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3">
      <g fill="#61DAFB">
          <path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z"/>
          <circle cx="420.9" cy="296.5" r="45.7"/>
          <path d="M520.5 78.1z"/>
      </g>
  </svg>
  
              `
                , () => { })


        })
    })



    fs.appendFile(`./${name}Project/${name}ReactApp/.gitignore`,
        `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
        `, () => { })

    fs.appendFile(`./${name}Project/${name}ReactApp/vite.config.js`,
        `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()]
})
        `, () => { })

    fs.appendFile(`./${name}Project/${name}ReactApp/index.html`,
        `
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/src/logo.svg" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>${name}App</title>
        </head>
        
        <body>
            <div id="root"></div>
            <script type="module" src="/src/main.jsx"></script>
        </body>
        
        </html>
        `, () => { })


    fs.appendFile(`./${name}Project/${name}ReactApp/package.json`,
        `
        {
            "name": "${name}Project",
            "private": true,
            "version": "0.0.0",
            "scripts": {
              "dev": "vite",
              "build": "vite build",
              "preview": "vite preview"
            },
            "dependencies": {
              "@emotion/react": "^11.8.2",
              "@emotion/styled": "^11.8.1",
              "@mui/material": "^5.5.3",
              "axios": "^0.26.1",
              "react-router-dom": "^5.3.0",
              "react": "^17.0.2",
              "react-dom": "^17.0.2"
            },
            "devDependencies": {
              "@vitejs/plugin-react": "^1.0.7",
              "vite": "^2.9.0"
            }
          }
        `, () => { })
}