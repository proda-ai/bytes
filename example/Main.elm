module Maine exposing (..)

import Bytes
import Bytes.Encode as E
import Bytes.Decode as D
import Html
import Maybe


main = Html.text <| Maybe.withDefault "Fail" <| D.decode (D.string 4) <| E.encode <| E.string "asdf" 
